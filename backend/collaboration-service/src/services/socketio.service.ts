import loggerUtil from '../common/logger.util'
import { Server as IOServer, Socket } from 'socket.io'
import { completeCollaborationSession } from './collab.service'
import { updateChatHistory, updateLanguage } from '../models/collab.repository'
import { LanguageMode } from '../types/LanguageMode'
import { ChatModel } from '../types'
import { IResponse, ISubmission } from '@repo/submission-types'
import { SubmissionResponseDto } from '../types/SubmissionResponseDto'
import { submitCode } from '../controllers/collab.controller'

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

            socket.on('send_message', (data: ChatModel) => {
                this.io.to(data.roomId).emit('receive_message', data)
                updateChatHistory(data.roomId, data)
            })

            socket.on('change-language', async (language: string) => {
                this.io.to(roomId).emit('update-language', language)
                this.languages.set(roomId, language)
                await updateLanguage(roomId, language as LanguageMode)
            })

            socket.on('run-code', async (data: ISubmission) => {
                this.io.to(roomId).emit('executing-code')
                try {
                    const dto: SubmissionResponseDto = await submitCode(data)
                    const { stdout, status, time } = dto
                    const response: IResponse = { stdout, status, time }
                    this.io.to(roomId).emit('code-executed', response, data.expected_output)
                } catch (err) {
                    this.io.to(roomId).emit('code-executed', { error: err })
                }
            })

            socket.on('disconnect', async () => {
                const room = this.io.sockets.adapter.rooms.get(roomId)
                socket.leave(roomId)
                if (!this.isUserInRoom(roomId, name)) {
                    const m: ChatModel = {
                        senderId: '',
                        message: name,
                        createdAt: new Date(),
                        roomId: roomId,
                    }
                    this.io.to(roomId).emit('user-disconnected', m)
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
