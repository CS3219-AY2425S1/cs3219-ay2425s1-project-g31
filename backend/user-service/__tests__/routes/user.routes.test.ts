import { Proficiency, Role } from '@repo/user-types'
import { MongoDBContainer, StartedMongoDBContainer } from '@testcontainers/mongodb'
import { generateKeyPairSync } from 'crypto'
import express, { Express } from 'express'
import 'express-async-errors'
import mongoose from 'mongoose'
import { agent, Agent } from 'supertest'
import logger from '../../src/common/logger.util'
import connectToDatabase from '../../src/common/mongodb.util'
import { generateAccessToken } from '../../src/common/token.util'
import defaultErrorHandler from '../../src/middlewares/errorHandler.middleware'
import '../../src/middlewares/passportJwt.middleware'
import userSchema from '../../src/models/user.model'
import userRouter from '../../src/routes/user.routes'
import { IUser } from '../../src/types/IUser'
import { UserDto } from '../../src/types/UserDto'

// Mock the environment variables
jest.mock('../../src/common/config.util', () => {
    // Generate RSA key pair for testing
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    })
    return {
        NODE_ENV: 'test',
        PORT: '3002',
        ACCESS_TOKEN_PRIVATE_KEY: Buffer.from(privateKey).toString('base64'),
        ACCESS_TOKEN_PUBLIC_KEY: Buffer.from(publicKey).toString('base64'),
    }
})

describe('User Routes', () => {
    let app: Express
    let testAgent: Agent
    let startedContainer: StartedMongoDBContainer

    const CREATE_USER_DTO1 = {
        username: 'test1',
        password: 'Test1234!',
        email: 'test@gmail.com',
        role: Role.ADMIN,
        proficiency: Proficiency.INTERMEDIATE,
    }

    const CREATE_USER_DTO2 = {
        username: 'test2',
        password: 'Test1234!',
        email: 'test2@gmail.com',
        role: Role.ADMIN,
        proficiency: Proficiency.INTERMEDIATE,
    }

    beforeAll(async () => {
        const container: MongoDBContainer = new MongoDBContainer().withExposedPorts(27017)
        startedContainer = await container.start()

        const connectionString = `${startedContainer.getConnectionString()}?directConnection=true`
        logger.info(`[User Routes Test] MongoDB container started on ${connectionString}`)

        app = express()
        app.use(express.json())
        app.use('/users', userRouter)
        app.use(defaultErrorHandler)

        testAgent = agent(app)

        await connectToDatabase(connectionString)
    }, 60000)

    afterAll(async () => {
        await startedContainer.stop()
        logger.info(`[User Routes Test] MongoDB container stopped`)
    })

    afterEach(async () => {
        await mongoose.connection.db!.dropDatabase()
    })

    describe('POST /users', () => {
        it('should return 201 and return the new user', async () => {
            const response = await testAgent.post('/users').send(CREATE_USER_DTO1)
            expect(response.status).toBe(201)
            expect(response.body).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    username: 'test1',
                    email: 'test@gmail.com',
                    role: Role.ADMIN,
                    proficiency: Proficiency.INTERMEDIATE,
                })
            )
        })
        it('should return 400 for invalid requests and a list of errors', async () => {
            const response = await testAgent.post('/users').send({})
            expect(response.status).toBe(400)
            expect(response.body).toEqual(expect.arrayContaining([expect.any(String)]))
        })
        it('should return 409 for duplicate username or email', async () => {
            await testAgent.post('/users').send(CREATE_USER_DTO1)
            const response = await testAgent.post('/users').send(CREATE_USER_DTO1)
            expect(response.status).toBe(409)
        })
    })

    describe('Protected Routes', () => {
        let accessToken: string
        let user: IUser
        let authenticatedTestAgent: Agent

        beforeEach(async () => {
            // Generate access token for the created user
            user = await mongoose.connection.model<IUser>('User', userSchema).create(CREATE_USER_DTO1)
            const dto = UserDto.fromModel(user)
            accessToken = await generateAccessToken(dto)
            authenticatedTestAgent = agent(app).auth(accessToken, { type: 'bearer' })
        })

        describe('PUT /users/:id', () => {
            it('should return 200 for successful update', async () => {
                const response = await authenticatedTestAgent.put(`/users/${user.id}`).send({
                    username: 'test3',
                    proficiency: Proficiency.ADVANCED,
                })
                expect(response.status).toBe(200)
                expect(response.body.username).toEqual('test3')
                expect(response.body.proficiency).toEqual(Proficiency.ADVANCED)
            })
            // handleAccessControl will return 403 as the id of the token does not match the id in the request
            it('should return 403 for requests with invalid ids', async () => {
                const response = await authenticatedTestAgent.put('/users/111').send({
                    username: 'test3',
                    proficiency: Proficiency.ADVANCED,
                })
                expect(response.status).toBe(403)
            })
            it('should return 400 for invalid requests and a list of errors', async () => {
                const response = await authenticatedTestAgent.put(`/users/${user.id}`).send({})
                expect(response.status).toBe(400)
                expect(response.body).toEqual(expect.arrayContaining([expect.any(String)]))
            })
            it('should return 409 for duplicate username', async () => {
                await authenticatedTestAgent.post('/users').send(CREATE_USER_DTO2)
                const response = await authenticatedTestAgent.put(`/users/${user.id}`).send({
                    username: 'test2',
                    proficiency: Proficiency.ADVANCED,
                })
                expect(response.status).toBe(409)
            })
        })

        describe('GET /users', () => {
            it('should return 200 for successful get', async () => {
                const response = await authenticatedTestAgent.get(`/users/${user.id}`).send()
                expect(response.status).toBe(200)
                expect(response.body).toEqual(
                    expect.objectContaining({
                        id: expect.any(String),
                        username: 'test1',
                        email: 'test@gmail.com',
                        role: Role.ADMIN,
                        proficiency: Proficiency.INTERMEDIATE,
                    })
                )
            })
            it('should return 403 for non-existent ids', async () => {
                const testID = '000000000000000000000000' // MongoDB ID is 24 char
                const response = await authenticatedTestAgent.get(`/users/${testID}`).send()
                expect(response.status).toBe(403)
            })
            it('should return 403 for non-existent/invalid ids', async () => {
                const response = await authenticatedTestAgent.get('/users/123').send()
                expect(response.status).toBe(403)
            })
        })

        describe('DELETE /users/:id', () => {
            it('should return 204 for successful deletion', async () => {
                const response = await authenticatedTestAgent.delete(`/users/${user.id}`).send()
                expect(response.status).toBe(204)
            })
            //handleAccessControl will return 403 as the id of the token does not match the id in the request
            it('should return 403 for requests with invalid ids', async () => {
                const response = await authenticatedTestAgent.delete('/users/111').send()
                expect(response.status).toBe(403)
            })
        })

        describe('PUT /users/:id/password', () => {
            it('should return 200 for successful update', async () => {
                const response = await authenticatedTestAgent.put(`/users/${user.id}/password`).send({
                    password: 'Test12345!',
                })
                expect(response.status).toBe(200)
                expect(response.body.password).not.toEqual(user.password)
            })
            it('should return 400 for requests with invalid ids', async () => {
                const response = await authenticatedTestAgent.put('/users/111/password').send()
                expect(response.status).toBe(403)
            })
            it('should return 400 for requests with invalid passwords', async () => {
                const response = await authenticatedTestAgent.put(`/users/${user.id}/password`).send({
                    password: 'Test1234',
                })
                expect(response.status).toBe(400)
                expect(response.body).toEqual(expect.arrayContaining([expect.any(String)]))
            })
        })
    })
})
