import 'dotenv/config'
import http, { Server } from 'http'
import config from './common/config.util'
import logger from './common/logger.util'
import connectToDatabase from './common/mongodb.util'
import index from './index'
// @ts-expect-error - Yjs is not typed
import yUtils from 'y-websocket/bin/utils'
import WebSocket from 'ws'
import { WebSocketConnection } from './services/socketio.service'
import { saveCode } from './models/collab.repository'

connectToDatabase(config.DB_URL)

const server: Server = http.createServer(index)
const wss = new WebSocket.Server({ noServer: true })
new WebSocketConnection(Number(config.WS_PORT))

yUtils.setPersistence({
    bindState: async (docName, ydoc) => {
        logger.info(`Binding state for ${docName} ${ydoc}`)
    },
    writeState: async (docName, ydoc) => {
        const code = ydoc.getText('codemirror').toString()
        await saveCode(docName, code)
        logger.info(`Storing state for ${docName} ${code}`)
    },
})

server.on('upgrade', (request, socket, head) => {
    const token = request.headers['sec-websocket-protocol']
    if (!token) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
        socket.destroy()
        return
    }
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request)
    })
})

wss.on('connection', (ws, req) => {
    const docName = req.url.slice(1)
    yUtils.setupWSConnection(ws, req, { docName })
    ws.on('close', () => {})
})

server.listen(config.PORT, async () => {
    logger.info(`[Init] Server is listening on port ${config.PORT}`)
})
