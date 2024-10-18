import mqConnection from '../services/rabbitmq.service'
import logger from './logger.util'

export default async () => {
    await mqConnection.connect()
    await mqConnection.entryQueueConsumer().then(() => {
        logger.info(`[Entry-Queue] Listening to Entry Queue...`)
    })
}
