import 'dotenv/config'
import http from 'http'
import config from './common/config.util'
import logger from './common/logger.util'
// import connectToDatabase from './common/mongodb.util'
import index from './index'
import { Server, Socket } from 'socket.io'
import { DocumentService } from './services/document.service'
import { PeerEditorSelectionJSON, UpdateDocumentDTO } from '@repo/collaboration-types'

const server = http.createServer(index)

const io = new Server(server, {
    cors: {
        origin: '*',
    },
})

const documentService = new DocumentService()

io.on('connection', (socket: Socket) => {
    console.log('A user connected', socket.handshake.auth)

    socket.on('getDocument', (callback) => {
        callback(documentService.getDoc())
    })

    socket.on('pullDocumentUpdates', (version: number, ...args) => {
        const cb = args[args.length - 1]
        cb(documentService.getUpdates(version))
    })

    socket.on('updateDocument', (updateDocumentDto: UpdateDocumentDTO) => {
        const json = documentService.update(updateDocumentDto)
        io.emit('updatesRecieved', json)
        return json
    })

    socket.on('pushSelection', (clientId: string, selections: PeerEditorSelectionJSON) => {
        return socket.broadcast.emit('peer-selection', clientId, selections)
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('peer-selection', socket.handshake.auth.clientID, null)
    })
})

server.listen(config.PORT, async () => {
    logger.info(`[Init] Server is listening on port ${config.PORT}`)
})

// connectToDatabase(config.DB_URL)
