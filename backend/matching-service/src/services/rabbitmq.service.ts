import client, { Connection, Channel, GetMessage } from 'amqplib'

import config from '../common/config.util'
import { IUserQueueMessage } from '../types/IUserQueueMessage'
import logger from '../common/logger.util'

class RabbitMQConnection {
    connection!: Connection
    channel!: Channel
    private connected!: boolean

    async connect() {
        if (this.connected && this.channel) return
        else this.connected = true

        try {
            logger.info(`[Init] Connecting to Rabbit-MQ Server`)
            this.connection = await client.connect({
                protocol: 'amqp',
                hostname: config.RMQ_HOST,
                port: 5672,
                username: config.RMQ_USER,
                password: config.RMQ_PASSWORD,
            })

            logger.info(`[Init] Rabbit MQ Connection is ready`)

            this.channel = await this.connection.createChannel()

            logger.info(`[Init] Created RabbitMQ Channel successfully`)
        } catch (error) {
            this.connected = false
            logger.error(`[Error] Not connected to MQ Server: ${error}`)
        }
    }

    // Direct exchange for entry queue
    async sendToEntryQueue(message: IUserQueueMessage) {
        try {
            if (!this.channel) {
                await this.connect()
            }

            // Set durable true to ensure queue stays even with mq restart (does not include message persistance)
            await this.channel.assertExchange('Entry-Queue', 'direct', { durable: false })

            await this.channel.assertQueue('entry_queue', { durable: false })

            // Params: Queue, Exchange, Routing Key
            await this.channel.bindQueue('entry_queue', 'Entry-Queue', 'entry')
            this.channel.publish('Entry-Queue', 'entry', Buffer.from(JSON.stringify(message)), { expiration: '60000' })
        } catch (error) {
            logger.error(`[Error] Failed to send message to Entry-Queue: ${error}`)
            throw error
        }
    }

    async entryQueueConsumer() {
        try {
            await this.channel.assertExchange('Entry-Queue', 'direct', { durable: false })
            const q = await this.channel.assertQueue('entry_queue', { durable: false })
            await this.channel.bindQueue(q.queue, 'Entry-Queue', 'entry')
            this.channel.consume(
                q.queue,
                (msg) => {
                    if (msg.content) {
                        // Insert logic to check for possible match before re-queuing
                        logger.info('[Entry-Queue] User information queued ', msg.content.toString())
                        this.channel.ack(msg) // ACK removes message from queue
                    }
                },
                { noAck: false }
            )
        } catch (error) {
            logger.error(`[Error] Failed to consume Entry-Queue: ${error}`)
            throw error
        }
    }

    // Header Exchange for Waiting Queue
    async sendToWaitingQueue(message: IUserQueueMessage) {
        try {
            if (!this.channel) {
                await this.connect()
            }

            const queueName = `${message.proficiency}.${message.complexity}.${message.topic}`

            // Set durable true to ensure queue stays even with mq restart (does not include message persistance)
            await this.channel.assertExchange('Waiting-Queue', 'headers', { durable: false })

            // asserts if queue exists, if it does not, create one
            const q = await this.channel.assertQueue(queueName, { durable: false })

            // Params: Queue, Exchange, Routing Key, Headers
            await this.channel.bindQueue(q.queue, 'Waiting-Queue', '', {
                arguments: {
                    'x-match': 'all', // Ensures that all headers must match for the message to be routed
                    proficiency: message.proficiency,
                    complexity: message.complexity,
                    topic: message.topic,
                },
            })

            this.channel.publish('Waiting-Queue', '', Buffer.from(JSON.stringify(message)), {
                headers: {
                    proficiency: message.proficiency,
                    complexity: message.complexity,
                    topic: message.topic,
                },
            })
        } catch (error) {
            logger.error(`[Error] Failed to send message to Waiting-Queue: ${error}`)
            throw error
        }
    }

    // Only consume when the match is valid, and user to be removed from waiting queue
    async waitingQueueConsumer(queueName: string) {
        this.checkWaitingQueue(queueName)
    }

    // Checks if there is a user waiting in queried queueName
    async checkWaitingQueue(queueName: string): Promise<boolean> {
        const waitingUser: GetMessage | false = await this.channel.get(queueName, { noAck: false })
        if (waitingUser === false) {
            logger.info(`[Waiting-Queue] Queue ${queueName} does not exist or is empty.`)
            return false
        } else {
            logger.info(`[Waiting-Queue] A user is waiting in ${queueName}: `, waitingUser.content.toString())
            return true
        }
    }
}

const mqConnection = new RabbitMQConnection()

export default mqConnection
