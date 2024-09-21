import request from 'supertest'
import app from '../src/index'

jest.mock('../src/common/config.util', () => ({
    NODE_ENV: 'test',
    PORT: '3004',
    DB_URL: 'placeholder',
}))

describe('Index', () => {
    describe('GET /', () => {
        it('should return 200 OK', async () => {
            const response = await request(app).get('/')
            expect(response.status).toBe(200)
        })
    })
})