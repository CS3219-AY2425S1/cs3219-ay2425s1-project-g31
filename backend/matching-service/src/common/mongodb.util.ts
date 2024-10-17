import config from './config.util'
import { connect } from 'mongoose'
import logger from './logger.util'

export default async (connectionString: string): Promise<void> => {
    await connect(connectionString, {
        autoCreate: config.NODE_ENV !== 'production',
        autoIndex: config.NODE_ENV !== 'production',
    })
        .then(() => {
            logger.info(`[Init] Connected to database`)
        })
        .catch((error: Error) => {
            logger.error(`[Init] Failed to connect to database: ${error.message}`)
        })
}
