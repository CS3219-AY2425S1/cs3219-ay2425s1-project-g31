import client, { Connection, Channel, GetMessage, ConsumeMessage } from 'amqplib'

import config from '../common/config.util'
import { IUserQueueMessage } from '../types/IUserQueueMessage'
import logger from '../common/logger.util'
import { Proficiency } from '@repo/user-types'

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
            if (!this.channel) {
                await this.connect()
            }
            await this.channel.assertExchange('Entry-Queue', 'direct', { durable: false })
            const q = await this.channel.assertQueue('entry_queue', { durable: false })
            await this.channel.bindQueue(q.queue, 'Entry-Queue', 'entry')
            this.channel.consume(
                q.queue,
                async (msg) => {
                    if (msg.content) {
                        try {
                            this.attemptMatch(msg)
                            this.channel.ack(msg)
                        } catch (error) {
                            logger.error(`[Error] Failed to attempt match: ${error}`)
                            throw error
                        }
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
    async sendToWaitingQueue(message: IUserQueueMessage, queueName: string, ttl: string) {
        try {
            if (!this.channel) {
                await this.connect()
            }

            // Set durable true to ensure queue stays even with mq restart (does not include message persistance)
            await this.channel.assertExchange('Waiting-Queue', 'direct', { durable: false })

            // asserts if queue exists, if it does not, create one
            const q = await this.channel.assertQueue(queueName, { durable: false })

            // Params: Queue, Exchange, Routing Key
            await this.channel.bindQueue(q.queue, 'Waiting-Queue', queueName)

            this.channel.publish('Waiting-Queue', queueName, Buffer.from(JSON.stringify(message)), {
                expiration: ttl,
                headers: {
                    sentAt: Date.now(),
                },
            })

            logger.info(message)
            logger.info(`[Waiting-Queue] was put into ${queueName}`)
        } catch (error) {
            logger.error(`[Error] Failed to send message to Waiting-Queue: ${error}`)
            throw error
        }
    }

    // Checks if there is a user waiting in queried queueName
    async checkWaitingQueue(queueName: string): Promise<false | GetMessage> {
        try {
            if (!this.channel) {
                await this.connect()
            }
            await this.channel.assertQueue(queueName, { durable: false })
            const waitingUser: GetMessage | false = await this.channel.get(queueName, { noAck: false })
            if (waitingUser === false) {
                logger.info(`[Waiting-Queue] Queue ${queueName} does not exist or is empty.`)
                const queueInfo = await this.channel.checkQueue(queueName)
                if (queueInfo.messageCount === 0) await this.channel.deleteQueue(queueName) // Remove empty queue to reduce memory usage
            } else {
                logger.info(`[Waiting-Queue] A user is waiting in ${queueName}: ${waitingUser.content.toString()}`)
            }
            return waitingUser
        } catch (error) {
            logger.error(`[Error] Failed to check message in Waiting-Queue: ${error}`)
            throw error
        }
    }

    async attemptMatch(msg: ConsumeMessage) {
        try {
            // Insert logic to check for possible match before re-queuing
            const content: IUserQueueMessage = JSON.parse(msg.content.toString())
            logger.info(`[Entry-Queue] User information queued: ${JSON.stringify(content)}`)
            const destinationQueue = `${content.proficiency}.${content.complexity}.${content.topic}`

            // Check for exact match if possible, else
            const directMatch = await this.checkWaitingQueue(destinationQueue)

            if (directMatch) {
                // Add logic here that combines both users into one and returns
                logger.info(`[Waiting-Queue] Match found: ${directMatch.content.toString()}`)
                this.channel.ack(directMatch)
            } else {
                let match1: false | GetMessage = false
                let match2: false | GetMessage = false
                let queryQueueName1: string = ''
                let queryQueueName2: string = ''
                logger.info('[Waiting-Queue] No Direct Match found')
                switch (content.proficiency) {
                    case Proficiency.BEGINNER:
                        // If proficiency beginner, check intermediate
                        queryQueueName1 = `${Proficiency.INTERMEDIATE}.${content.complexity}.${content.topic}`
                        match1 = await this.checkWaitingQueue(queryQueueName1)
                        break
                    case Proficiency.INTERMEDIATE:
                        // If proficiency intermediate, check beginner and advanced
                        queryQueueName1 = `${Proficiency.BEGINNER}.${content.complexity}.${content.topic}`
                        queryQueueName2 = `${Proficiency.ADVANCED}.${content.complexity}.${content.topic}`
                        match1 = await this.checkWaitingQueue(queryQueueName1)
                        match2 = await this.checkWaitingQueue(queryQueueName2)
                        break
                    case Proficiency.ADVANCED:
                        // if proficiency advanced, check intermediate
                        queryQueueName1 = `${Proficiency.INTERMEDIATE}.${content.complexity}.${content.topic}`
                        match1 = await this.checkWaitingQueue(queryQueueName1)
                        break
                }
                if (match1 && match2) {
                    const messageTime1 = parseInt(match1.properties.headers.sentAt)
                    const messageTime2 = parseInt(match2.properties.headers.sentAt)
                    // Compare TTL values
                    if (messageTime1 < messageTime2) {
                        // Choose directMatch over match2
                        logger.info(`[Waiting-Queue] Match found: ${match1.content.toString()}`)
                        this.channel.ack(match1)
                        this.channel.nack(match2)
                    } else {
                        // Choose match2 over directMatch
                        logger.info(`[Waiting-Queue] Match found: ${match2.content.toString()}`)
                        this.channel.ack(match2)
                        this.channel.nack(match1)
                    }
                } else if (match1) {
                    // Only directMatch can match
                    logger.info(`[Waiting-Queue] Match found: ${match1.content.toString()}`)
                    // Choose match2 over directMatch
                    this.channel.ack(match1)
                } else if (match2) {
                    // Only match2 can match
                    logger.info(`[Waiting-Queue] Match found: ${match2.content.toString()}`)
                    // Choose match2 over directMatch
                    this.channel.ack(match2)
                } else {
                    // No match found, enqueue user into waiting queue
                    this.sendToWaitingQueue(content, destinationQueue, '60000')
                }
            }
        } catch (error) {
            logger.error(`[Entry-Queue] Issue checking with Waiting-Queue: ${error}`)
        }
    }
}

const mqConnection = new RabbitMQConnection()

export default mqConnection
