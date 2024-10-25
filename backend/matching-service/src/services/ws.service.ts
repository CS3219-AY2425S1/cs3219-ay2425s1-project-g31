import { IncomingMessage } from 'http'
import WebSocket, { Server as WebSocketServer } from 'ws'
import loggerUtil from '../common/logger.util'
import url from 'url'
import { addUserToMatchmaking, removeUserFromMatchingQueue } from '../controllers/matching.controller'
import { WebSocketMessageType } from '@repo/ws-types'
import config from '../common/config.util'

export class WebSocketConnection {
    private wss: WebSocketServer
    private clients: Map<string, WebSocket> = new Map()

    constructor() {
        this.wss = new WebSocketServer({ port: config.WS_PORT })
        this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
            const query = url.parse(req.url, true).query
            const websocketId = query.id as string

            if (!websocketId) {
                ws.close(1008, 'Missing userId')
                return
            }

            this.clients.set(websocketId, ws)

            // // Close connection after 2 minutes automatically
            // const closeAfterTimeout = setTimeout(() => {
            //     ws.close(1000, 'Connection closed by server after 2 minutes')
            // }, 120000)

            ws.on('message', (message: string) => this.handleMessage(message, websocketId))
            ws.on('close', () => {
                // clearTimeout(closeAfterTimeout)
                this.handleClose(websocketId)
            })
        })
    }

    public getClientsWebsockets() {
        return this.clients
    }

    private handleMessage(message: string, websocketId: string): void {
        if (!message) {
            loggerUtil.error(`Received empty message`)
            return
        }

        try {
            const data = JSON.parse(message)

            if (data.type === WebSocketMessageType.CANCEL) {
                removeUserFromMatchingQueue(websocketId, data.userId)
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

    public closeConnectionOnTimeout(websocketId: string): void {
        const client = this.clients.get(websocketId)
        if (client && client.readyState === WebSocket.OPEN) {
            client.close(1001, JSON.stringify({ type: WebSocketMessageType.FAILURE }))
        }
    }
}

const wsConnection = new WebSocketConnection()
export default wsConnection
