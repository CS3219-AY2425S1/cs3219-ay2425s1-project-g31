import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import logger from '../common/logger.util'

export default (error: Error, request: Request, response: Response, _: NextFunction) => {
    if (error instanceof mongoose.Error.CastError) {
        response.status(400).json('INVALID_ID').send()
    } else if (error instanceof mongoose.Error.DocumentNotFoundError) {
        response.status(404).json('NOT_FOUND').send()
    } else if (error instanceof mongoose.Error.ValidationError) {
        response.status(400).json('INVALID_DATA').send()
    } else {
        logger.error(`[Controller] [${request.method}  ${request.baseUrl + request.path}] ${error.message}`)
        response.status(500).send()
    }
}
