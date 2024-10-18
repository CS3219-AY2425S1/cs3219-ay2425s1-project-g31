import { IncomingMessage } from 'http'
import WebSocket, { Server as WebSocketServer } from 'ws'
import loggerUtil from '../common/logger.util'
import url from 'url'
import { addUserToMatchmaking, removeUserFromMatchingQueue } from '../controllers/matching.controller'
import { WebSocketMessageType } from '@repo/ws-types/src/WebSocketMessageType'

export class WebSocketConnection {
    private wss: WebSocketServer
    private clients: Map<string, WebSocket> = new Map()

    constructor() {
        this.wss = new WebSocketServer({ port: process.env.WS_PORT })
        this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
            const query = url.parse(req.url, true).query
            const websocketId = query.id as string

            if (!websocketId) {
                ws.close(1008, 'Missing userId')
                return
            }

            this.clients.set(websocketId, ws)
            ws.on('message', (message: string) => this.handleMessage(message, websocketId))
            ws.on('close', () => this.handleClose(websocketId))
        })
    }

    private handleMessage(message: string, websocketId: string): void {
        if (!message) {
            loggerUtil.error(`Received empty message`)
            return
        }

        try {
            const data = JSON.parse(message)

            if (data.type === WebSocketMessageType.CANCEL) {
                removeUserFromMatchingQueue(websocketId)
            } else if (data.userId) {
                addUserToMatchmaking(data)
            } else {
                loggerUtil.error(`Received an unknown message format: ${message}`)
            }
        } catch (error) {
            loggerUtil.error(`Error parsing message: ${error}`)
        }
    }

    // Handle WebSocket close event
    private handleClose(websocketId: string): void {
        loggerUtil.info(`User ${websocketId} disconnected`)
        this.clients.delete(websocketId)
    }

    // Send a message to a specific user by websocketId
    public sendMessageToUser(websocketId: string, message: string): void {
        const client = this.clients.get(websocketId)
        if (client && client.readyState === WebSocket.OPEN) {
            client.send(message)
        } else {
            loggerUtil.info(`User ${websocketId} is not connected`)
        }
    }
}

const wsConnection = new WebSocketConnection()
export default wsConnection
