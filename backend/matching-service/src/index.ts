import cors from 'cors'
import express, { Express, Request, Response } from 'express'
import 'express-async-errors'
import helmet from 'helmet'
import passport from 'passport'
import defaultErrorHandler from './middlewares/errorHandler.middleware'
import './middlewares/passportJwt.middleware'
import matchingRouter from './routes/matching.routes'

const app: Express = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())
app.use(helmet())
app.use(passport.initialize())
app.use('/matching', matchingRouter)

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
