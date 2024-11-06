import { Category, Complexity } from '@repo/question-types'
import { IAccessTokenPayload, Proficiency, Role } from '@repo/user-types'
import { MongoDBContainer, StartedMongoDBContainer } from '@testcontainers/mongodb'
import express, { Express } from 'express'
import 'express-async-errors'
import { sign, SignOptions } from 'jsonwebtoken'
import mongoose from 'mongoose'
import passport from 'passport'
import { agent, Agent } from 'supertest'
import configMock from '../../__mocks__/config.mock'
import { QUESTION_BANK } from '../../__mocks__/question.mock'
import logger from '../../src/common/logger.util'
import connectToDatabase from '../../src/common/mongodb.util'
import defaultErrorHandler from '../../src/middlewares/errorHandler.middleware'
import '../../src/middlewares/passportJwt.middleware'
import questionSchema from '../../src/models/question.model'
import questionRouter from '../../src/routes/question.routes'
import { IQuestion } from '../../src/types/IQuestion'
import { QuestionDto } from '../../src/types/QuestionDto'

// Mock the environment variables
jest.mock('../../src/common/config.util', () => configMock)

jest.mock('../../src/services/user.service.ts', () => {
    return {
        getUserById: jest.fn().mockResolvedValue({
            id: '000000000000000000000000',
            username: 'test',
            email: 'test@gmail.com',
            role: Role.ADMIN,
            proficiency: Proficiency.BEGINNER,
        }),
    }
})

describe('Question Routes', () => {
    let app: Express
    let startedContainer: StartedMongoDBContainer

    beforeAll(async () => {
        const container: MongoDBContainer = new MongoDBContainer().withExposedPorts(27017)
        startedContainer = await container.start()

        const connectionString = `${startedContainer.getConnectionString()}?directConnection=true`
        logger.info(`[Question Routes Test] MongoDB container started on ${connectionString}`)

        app = express()
        app.use(express.json())
        app.use(passport.initialize())

        app.use('/questions', questionRouter)
        app.use(defaultErrorHandler)

        await connectToDatabase(connectionString)
    }, 60000)

    afterAll(async () => {
        await startedContainer.stop()
        logger.info(`[Question Routes Test] MongoDB container stopped`)
    })

    afterEach(async () => {
        await mongoose.connection.db!.dropDatabase()
    })

    describe('Protected Routes', () => {
        let accessToken: string
        let authenticatedTestAgent: Agent

        beforeAll(async () => {
            // Generate access token for the some user
            const payload: Partial<IAccessTokenPayload> = {
                id: '000000000000000000000000',
                admin: false,
            }
            const options: SignOptions = {
                subject: 'test@gmail.com',
                algorithm: 'RS256', // Assymetric Algorithm
                expiresIn: '1h',
                issuer: 'user-service',
                audience: 'frontend',
            }
            accessToken = sign(payload, Buffer.from(configMock.ACCESS_TOKEN_PRIVATE_KEY, 'base64'), options)
            authenticatedTestAgent = agent(app).auth(accessToken, { type: 'bearer' })
        })

        describe('GET /questions', () => {
            beforeEach(async () => {
                await mongoose.model<IQuestion>('Question', questionSchema).bulkWrite(
                    QUESTION_BANK.map((question) => ({
                        insertOne: {
                            document: question,
                        },
                    }))
                )
                await mongoose.model<IQuestion>('Question', questionSchema).createIndexes()
            })

            it('should return 200 OK and a list of all the questions with the pagination information', async () => {
                const queryParams = {
                    page: '1',
                    limit: '10',
                }
                const {
                    status,
                    body: { pagination, questions },
                } = await authenticatedTestAgent.get('/questions').query(queryParams)
                expect(status).toBe(200)
                expect(pagination).toEqual({
                    currentPage: 1,
                    nextPage: 2,
                    totalPages: Math.ceil(QUESTION_BANK.length / 10),
                    totalItems: QUESTION_BANK.length,
                    limit: 10,
                })
                expect(questions).toHaveLength(10)
            })

            it('should return 400 BAD REQUEST when the page or limit query parameter is not a number', async () => {
                const queryParams = {
                    page: 'invalid',
                    limit: '10',
                }
                const { status } = await authenticatedTestAgent.get('/questions').query(queryParams)
                expect(status).toBe(400)
            })

            it('should return 400 BAD REQUEST when the filter parameters are invalid', async () => {
                const queryParams = {
                    page: '1',
                    limit: '10',
                    filterBy: 'invalid:invalid',
                }
                const { status } = await authenticatedTestAgent.get('/questions').query(queryParams)
                expect(status).toBe(400)
            })

            it('should return 400 BAD REQUEST when the sort parameters are invalid', async () => {
                const queryParams = {
                    page: '1',
                    limit: '10',
                    sortBy: 'invalid:invalid',
                }
                const { status } = await authenticatedTestAgent.get('/questions').query(queryParams)
                expect(status).toBe(400)
            })

            it('should return 200 OK and a list of filtered questions when a valid title search parameter is provided', async () => {
                const queryParams = {
                    page: '1',
                    limit: '20',
                    filterBy: 'title:a',
                }
                const {
                    status,
                    body: { questions },
                } = await authenticatedTestAgent.get('/questions').query(queryParams)
                expect(status).toBe(200)
                expect(questions).toHaveLength(QUESTION_BANK.filter((q) => q.title.includes('a')).length)
            })

            it('should return 200 OK and a list of filtered questions when a valid filter parameter is provided', async () => {
                const queryParams = {
                    page: '1',
                    limit: '20',
                    filterBy: 'title:a,categories:ALGORITHMS',
                }
                const {
                    status,
                    body: { questions },
                } = await authenticatedTestAgent.get('/questions').query(queryParams)
                expect(status).toBe(200)
                expect(questions).toHaveLength(
                    QUESTION_BANK.filter((q) => q.title.includes('a') && q.categories.includes(Category.ALGORITHMS))
                        .length
                )
            })

            it('should return 200 OK and a list of sorted questions when a valid sort parameter is provided', async () => {
                const queryParams = {
                    page: '1',
                    limit: '20',
                    sortBy: 'complexity:asc',
                }
                const {
                    status,
                    body: { questions },
                } = await authenticatedTestAgent.get('/questions').query(queryParams)
                expect(status).toBe(200)
                const isSorted = questions.every(
                    (question: QuestionDto, index: number) =>
                        index === 0 ||
                        Object.values(Complexity).indexOf(question.complexity) >=
                            Object.values(Complexity).indexOf(questions[index - 1].complexity)
                )
                expect(isSorted).toBe(true)
            })
        })

        describe('PUT /questions/:id', () => {
            let question: IQuestion
            beforeEach(async () => {
                question = await mongoose.model<IQuestion>('Question', questionSchema).create(QUESTION_BANK[0])
            })
            it('should return 200 OK for successful update', async () => {
                const response = await authenticatedTestAgent.put(`/questions/${question.id}`).send({
                    id: question.id,
                    title: 'new title',
                    description: 'new description',
                    categories: [Category.ALGORITHMS],
                    complexity: Complexity.MEDIUM,
                    link: 'https://www.newlink.com',
                    testInputs: ['hello', 'Hannah'],
                    testOutputs: ['olleh', 'hannaH'],
                })
                expect(response.status).toBe(200)
                expect(response.body.title).toEqual('new title')
                expect(response.body.description).toEqual('new description')
                expect(response.body.categories).toEqual([Category.ALGORITHMS])
                expect(response.body.complexity).toEqual(Complexity.MEDIUM)
                expect(response.body.link).toEqual('https://www.newlink.com')
                expect(response.body.testInputs).toEqual(['hello', 'Hannah'])
                expect(response.body.testOutputs).toEqual(['olleh', 'hannaH'])
            })

            it('should return 400 BAD REQUEST for invalid requests and a list of errors', async () => {
                const response = await authenticatedTestAgent.put(`/questions/${question.id}`).send({})
                expect(response.status).toBe(400)
                expect(response.body).toEqual(expect.arrayContaining([expect.any(String)]))
            })

            it('should return 404 NOT FOUND for requests with invalid ids', async () => {
                const response = await authenticatedTestAgent.put('/questions/000000000000000000000000').send({
                    id: '000000000000000000000000',
                    title: 'new title',
                    description: 'new description',
                    categories: [Category.ALGORITHMS],
                    complexity: Complexity.MEDIUM,
                    link: 'https://www.newlink.com',
                    testInputs: ['hello', 'Hannah'],
                    testOutputs: ['olleh', 'hannaH'],
                })
                expect(response.status).toBe(404)
            })

            it('should return 409 CONFLICT for requests with duplicate titles', async () => {
                await mongoose.model<IQuestion>('Question', questionSchema).create(QUESTION_BANK[1])
                const response = await authenticatedTestAgent.put(`/questions/${question.id}`).send({
                    id: question.id,
                    title: QUESTION_BANK[1].title,
                    description: 'new description',
                    categories: [Category.ALGORITHMS],
                    complexity: Complexity.MEDIUM,
                    link: 'https://www.newlink.com',
                    testInputs: ['1->2->3->4->2', '1->2->3->4->5'],
                    testOutputs: ['true', 'false'],
                })
                expect(response.status).toBe(409)
            })
        })

        describe('POST /questions/:id', () => {
            it('should return 201 CREATED for successful creation', async () => {
                const response = await authenticatedTestAgent.post('/questions').send({
                    title: 'new title',
                    description: 'new description',
                    categories: [Category.ALGORITHMS],
                    complexity: Complexity.MEDIUM,
                    link: 'https://www.newlink.com',
                    testInputs: ['1->2->3->4->2', '1->2->3->4->5'],
                    testOutputs: ['true', 'false'],
                })
                expect(response.status).toBe(201)
                expect(response.body.title).toEqual('new title')
                expect(response.body.description).toEqual('new description')
                expect(response.body.categories).toEqual([Category.ALGORITHMS])
                expect(response.body.complexity).toEqual(Complexity.MEDIUM)
                expect(response.body.link).toEqual('https://www.newlink.com')
                expect(response.body.testInputs).toEqual(['1->2->3->4->2', '1->2->3->4->5'])
                expect(response.body.testOutputs).toEqual(['true', 'false'])
            })

            it('should return 400 BAD REQUEST for invalid requests and a list of errors', async () => {
                const response = await authenticatedTestAgent.post('/questions').send({})
                expect(response.status).toBe(400)
                expect(response.body).toEqual(expect.arrayContaining([expect.any(String)]))
            })

            it('should return 409 CONFLICT for requests with duplicate titles', async () => {
                await mongoose.model<IQuestion>('Question', questionSchema).create(QUESTION_BANK[0])
                const response = await authenticatedTestAgent.post('/questions').send({
                    title: QUESTION_BANK[0].title,
                    description: 'new description',
                    categories: [Category.ALGORITHMS],
                    complexity: Complexity.MEDIUM,
                    link: 'https://www.newlink.com',
                    testInputs: ['1->2->3->4->2', '1->2->3->4->5'],
                    testOutputs: ['true', 'false'],
                })
                expect(response.status).toBe(409)
            })
        })
    })
})
