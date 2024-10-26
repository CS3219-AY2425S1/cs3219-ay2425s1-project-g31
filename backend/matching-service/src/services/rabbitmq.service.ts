import client, { Connection, Channel, GetMessage, ConsumeMessage } from 'amqplib'

import config from '../common/config.util'
import { IUserQueueMessage } from '../types/IUserQueueMessage'
import logger from '../common/logger.util'
import { Proficiency } from '@repo/user-types'
import { IMatch } from '../types/IMatch'
import { handleCreateMatch } from '../controllers/matching.controller'
import wsConnection from '../services/ws.service'

class RabbitMQConnection {
    connection!: Connection
    channel!: Channel
    private connected!: boolean
    private cancelledUsers: Set<string>
    private currentUsers: Set<string>

    public userCurrentlyConnected(userId: string) {
        return this.currentUsers.has(userId)
    }

    public addUserConnected(userId: string) {
        this.currentUsers.add(userId)
    }

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

            this.cancelledUsers = new Set<string>()
            this.currentUsers = new Set<string>()

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

            if (this.cancelledUsers.has(message.websocketId)) {
                this.currentUsers.delete(message.userId)
                logger.info(`[Entry-Queue] Blacklisted user ${message.userId} tried to enter queue`)
                return
            }

            // Set durable true to ensure queue stays even with mq restart (does not include message persistance)
            await this.channel.assertExchange('Entry-Queue', 'direct', { durable: false })

            await this.channel.assertQueue('entry_queue', {
                durable: false,
                arguments: this.getDlxArgs(),
            })

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

            const q = await this.channel.assertQueue('entry_queue', {
                durable: false,
                arguments: this.getDlxArgs(),
            })
            await this.channel.bindQueue(q.queue, 'Entry-Queue', 'entry')
            this.channel.consume(
                q.queue,
                async (msg) => {
                    if (msg && msg.content) {
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
            const q = await this.channel.assertQueue(queueName, {
                durable: false,
                arguments: this.getDlxArgs(),
            })

            // Params: Queue, Exchange, Routing Key
            await this.channel.bindQueue(q.queue, 'Waiting-Queue', queueName)

            this.channel.publish('Waiting-Queue', queueName, Buffer.from(JSON.stringify(message)), {
                expiration: ttl,
                headers: {
                    sentAt: Date.now(),
                    websocketId: message.websocketId,
                    userId: message.userId,
                },
            })

            logger.info(`[Waiting-Queue] ${JSON.stringify(message)} was put into ${queueName}`)
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
            await this.channel.assertQueue(queueName, {
                durable: false,
                arguments: this.getDlxArgs(),
            })
            const waitingUser: GetMessage | false = await this.channel.get(queueName, { noAck: false })
            if (waitingUser === false) {
                logger.info(`[Check-Waiting-Queue] Queue ${queueName} does not exist or is empty.`)
                await this.removeIfEmptyQueue(queueName)
            } else {
                if (waitingUser.content) {
                    const content: IUserQueueMessage = JSON.parse(waitingUser.content.toString())
                    if (this.cancelledUsers.has(content.websocketId)) {
                        this.channel.ack(waitingUser)
                        this.currentUsers.delete(content.userId)
                        this.cancelledUsers.delete(content.websocketId)
                        return false
                    } else {
                        logger.info(
                            `[Check-Waiting-Queue] A user is waiting in ${queueName}: ${waitingUser.content.toString()}`
                        )
                    }
                }
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

            let matchedUser: client.GetMessage = null

            if (directMatch) {
                const directMatchContent = JSON.parse(directMatch.content.toString())
                if (this.cancelledUsers.has(directMatchContent.websocketId)) {
                    logger.info(`[Waiting-Queue] User ${directMatchContent.userId} has withdrawn from queue`)
                    this.channel.ack(directMatch)
                    this.currentUsers.delete(directMatchContent.userId)
                    this.cancelledUsers.delete(directMatchContent.websocketId)
                    return
                } else {
                    // Add logic to combine users
                    logger.info(`[Waiting-Queue] Match found: ${directMatch.content.toString()}`)
                    matchedUser = directMatch
                    this.channel.ack(directMatch)
                    await this.removeIfEmptyQueue(destinationQueue)
                }
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
                        matchedUser = match1
                        this.channel.nack(match2)
                        await this.removeIfEmptyQueue(queryQueueName1)
                    } else {
                        // Choose match2 over directMatch
                        logger.info(`[Waiting-Queue] Match found: ${match2.content.toString()}`)
                        this.channel.ack(match2)
                        matchedUser = match2
                        this.channel.nack(match1)
                        await this.removeIfEmptyQueue(queryQueueName2)
                    }
                } else if (match1) {
                    // Only directMatch can match
                    logger.info(`[Waiting-Queue] Match found: ${match1.content.toString()}`)
                    // Choose match2 over directMatch
                    matchedUser = match1
                    this.channel.ack(match1)
                    await this.removeIfEmptyQueue(queryQueueName1)
                } else if (match2) {
                    // Only match2 can match
                    logger.info(`[Waiting-Queue] Match found: ${match2.content.toString()}`)
                    // Choose match2 over directMatch
                    matchedUser = match2
                    this.channel.ack(match2)
                    await this.removeIfEmptyQueue(queryQueueName2)
                } else {
                    // No match found, enqueue user into waiting queue
                    this.sendToWaitingQueue(content, destinationQueue, '60000')
                }
            }

            if (matchedUser) {
                const matchedUserContent = JSON.parse(matchedUser.content.toString())
                const match: Partial<IMatch> = {
                    user1Id: content.userId,
                    user1Name: content.userName,
                    user2Id: matchedUserContent.userId,
                    user2Name: matchedUserContent.userName,
                    category: content.topic,
                    complexity: content.complexity,
                }
                await handleCreateMatch(match as IMatch, content.websocketId, matchedUserContent.websocketId)
                this.currentUsers.delete(content.userId)
                this.currentUsers.delete(matchedUserContent.userId)
                this.cancelledUsers.delete(content.websocketId)
                this.cancelledUsers.delete(matchedUserContent.websocketId)
                logger.info(`[Match] Match created and stored successfully: ${JSON.stringify(match)}`)
            }
        } catch (error) {
            logger.error(`[Entry-Queue] Issue checking with Waiting-Queue: ${error}`)
        }
    }

    // If queue is empty remove queue, else do nothing (queue must already exist)
    async removeIfEmptyQueue(queueName: string) {
        try {
            const queueInfo = await this.channel.checkQueue(queueName)
            if (queueInfo.messageCount === 0) await this.channel.deleteQueue(queueName) // Remove empty queue to reduce memory usage
            // logger.info(`[Delete-Queue] Deleted empty queue: ${queueName}`)
        } catch (error) {
            logger.error(`[Waiting-Queue] Failed to delete queue ${queueName}: ${error}`)
        }
    }

    async cancelUser(websocketId: string, userId: string) {
        this.cancelledUsers.add(websocketId)
        this.currentUsers.delete(userId)
        logger.info(`[Cancel-User] User ${websocketId} has been blacklisted from matchmaking`)
    }

    async listenToDeadLetterQueue() {
        try {
            if (!this.channel) {
                await this.connect()
            }

            const dlxArgs = this.getDlxArgs()
            const DLX_QUEUE = 'deadletter-queue'
            const DLX_EXCHANGE = dlxArgs['x-dead-letter-exchange']
            const DLX_ROUTING_KEY = dlxArgs['x-dead-letter-routing-key']

            await this.channel.assertExchange(DLX_EXCHANGE, 'direct', { durable: false })
            await this.channel.assertQueue(DLX_QUEUE, { durable: false })
            await this.channel.bindQueue(DLX_QUEUE, DLX_EXCHANGE, DLX_ROUTING_KEY)

            await this.channel.consume(DLX_QUEUE, (msg) => {
                if (msg) {
                    const socketId = msg.properties?.headers?.websocketId
                    const userId = msg.properties?.headers?.userId
                    const queue = msg.properties?.headers['x-first-death-queue']
                    logger.info(
                        `[DeadLetter-Queue] Received dead letter message from ${queue}, with socketId ${socketId}`
                    )
                    wsConnection.closeConnectionOnTimeout(socketId)
                    this.channel.ack(msg)
                    this.currentUsers.delete(userId)
                    this.cancelledUsers.delete(socketId)
                }
            })
        } catch (error) {
            logger.error('[DeadLetter-Queue] Error while consuming from the dead letter queue:', error)
        }
    }

    private getDlxArgs() {
        return {
            'x-dead-letter-exchange': 'dlx',
            'x-dead-letter-routing-key': 'dlx-key',
        }
    }
}

const mqConnection = new RabbitMQConnection()

export default mqConnection
