import cors from 'cors'
import express, { Express, NextFunction, Request, Response } from 'express'
import 'express-async-errors'
import helmet from 'helmet'
import passport from 'passport'
import defaultErrorHandler from './middlewares/errorHandler.middleware'
import './middlewares/passportJwt.middleware'
import questionRouter from './routes/question.routes'

const app: Express = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())
app.use(helmet())

app.use(passport.initialize())

// To handle CORS Errors
app.use((request: Request, response: Response, next: NextFunction) => {
    response.header('Access-Control-Allow-Origin', '*') // "*" -> Allow all links to access

    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

    // Browsers usually send this before PUT or POST Requests
    if (request.method === 'OPTIONS') {
        response.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, PATCH')
        response.status(200).send()
        return
    }

    // Continue Route Processing
    next()
})

app.use('/questions', questionRouter)

// Health Check Route
app.get('/', (_: Request, response: Response) => {
    response.status(200).send()
})

//  Not Found Route
app.use((_: Request, response: Response) => {
    response.status(404).send()
})

// Default Error Handler
app.use(defaultErrorHandler)

export default app
