import 'dotenv/config'
import http, { Server } from 'http'
import config from './common/config.util'
import logger from './common/logger.util'
import connectToDatabase from './common/mongodb.util'
import index from './index'
import connectToRabbitMQ from './common/rabbitmq.util'
import { WebSocketServer, WebSocket } from 'ws'

connectToRabbitMQ()
connectToDatabase(config.DB_URL)

const server: Server = http.createServer(index)
server.listen(config.PORT, async () => {
    logger.info(`[Init] Server is listening on port ${config.PORT}`)
})

// Initialize WebSocketServer with the same HTTP server
const wss = new WebSocketServer({ port: 8080 })

wss.on('connection', function connection(ws: WebSocket) {
    console.log('Client connected')

    ws.on('error', console.error)

    ws.on('message', function message(data: string) {
        console.log('Received: %s', data)
    })

    ws.send('Welcome to the WebSocket server')
})

console.log('WebSocket server running on ws://localhost:8081')
