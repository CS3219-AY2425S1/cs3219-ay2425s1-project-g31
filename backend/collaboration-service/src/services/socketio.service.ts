import loggerUtil from '../common/logger.util'
import { Server as IOServer, Socket } from 'socket.io'
import { completeCollaborationSession } from './collab.service'

export class WebSocketConnection {
    private io: IOServer
    private languages: Map<string, string> = new Map()

    constructor(port: number) {
        this.io = new IOServer(port, {
            cors: {
                origin: '*',
            },
        })
        this.middleware()
        this.io.on('connection', (socket: Socket) => {
            const { name, roomId } = socket.data

            socket.on('joinRoom', ({ roomId }) => {
                socket.join(roomId)
                this.io.to(roomId).emit('user-connected', name)
                if (this.languages.has(roomId)) {
                    socket.emit('update-language', this.languages.get(roomId))
                }
            })

            socket.on('change-language', (language: string) => {
                this.io.to(roomId).emit('update-language', language)
                this.languages.set(roomId, language)
            })

            socket.on('disconnect', async () => {
                const room = this.io.sockets.adapter.rooms.get(roomId)
                socket.leave(roomId)
                if (!this.isUserInRoom(roomId, name)) {
                    this.io.to(roomId).emit('user-disconnected', name)
                    loggerUtil.info(`User ${name} disconnected from room ${roomId}`)
                }
                if (!room) {
                    loggerUtil.info(`Room ${roomId} is empty. Completing session.`)
                    await completeCollaborationSession(roomId)
                    this.languages.delete(roomId)
                }
            })
        })
    }

    private middleware() {
        this.io.use((socket, next) => {
            const token = socket.handshake.auth.token
            loggerUtil.info(`Token: ${token}`)
            if (!token) {
                return next(new Error('Authentication error'))
            }
            socket.data = { name: socket.handshake.auth.name, roomId: socket.handshake.auth.roomId }
            next()
        })
    }

    private isUserInRoom(roomId: string, username: string): boolean {
        const room = this.io.sockets.adapter.rooms.get(roomId)
        if (!room) return false

        for (const socketId of room) {
            const socket = this.io.sockets.sockets.get(socketId)
            if (socket && socket.data.user && socket.data.user.username === username) {
                return true
            }
        }

        return false
    }
}