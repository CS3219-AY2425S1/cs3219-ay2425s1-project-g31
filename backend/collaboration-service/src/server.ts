import 'dotenv/config'
import http, { Server } from 'http'
import config from './common/config.util'
import logger from './common/logger.util'
import connectToDatabase from './common/mongodb.util'
import index from './index'
import { setupWSConnection } from './yjs.js'
import WebSocket from 'ws'

const server: Server = http.createServer(index)
const wss = new WebSocket.Server({ noServer: true })

server.on('upgrade', (request, socket, head) => {
    // auth middelware
    const token = request.headers['sec-websocket-protocol']
    if (!token) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
        socket.destroy()
        return
    }
    console.log(token)
    const user = {
        id: '1',
    }
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request, user)
    })
})
// Handle Yjs WebSocket connection
wss.on('connection', (ws, req, user) => {
    const docName = req.url.slice(1) // Use the URL as the document name
    setupWSConnection(ws, req, { docName })
    console.log(`User ${user.id} connected to document: ${docName}`)
    ws.on('close', () => {
        console.log(`User ${user.id} disconnected`)
    })
})

server.listen(config.PORT, async () => {
    logger.info(`[Init] Server is listening on port ${config.PORT}`)
})

connectToDatabase(config.DB_URL)
