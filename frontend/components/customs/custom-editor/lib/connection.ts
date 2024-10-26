import { Socket, io } from 'socket.io-client'
import { IPeerConnection, PeerEditorSelectionJSON } from '@repo/collaboration-types'
import { Update } from '@codemirror/collab'

type PConnection = IPeerConnection & { socket: Socket; connect: () => void }

export const createPeerConnection = (clientID: string): PConnection => {
    const url = 'http://localhost:3008' // To be changed

    const socket = io(url, {
        transports: ['websocket'],
        auth: {
            clientID,
        },
    })

    return {
        socket,

        connect() {
            socket.connect()
        },

        onConnected(handler: () => void) {
            socket.on('connect', handler)
        },

        onDisconnected(handler: () => void) {
            socket.on('disconnect', handler)
        },

        pullUpdates(version: number) {
            return socket.timeout(3000).emitWithAck('pullDocumentUpdates', version) as Promise<Update[]>
        },

        pushUpdates(version: number, updates) {
            socket.emit('updateDocument', { version, updates })
        },

        onUpdatesReceived(handler) {
            socket.on('updatesRecieved', handler)
        },

        onBroadcastLocalSelection(clientId: string, selection: PeerEditorSelectionJSON) {
            socket.emit('pushSelection', clientId, selection)
        },

        onReceiveSelection(handler) {
            socket.on('peer-selection', handler)
        },

        endSession() {
            socket.emit('endSession', { clientID })
        },

        destroy() {
            socket.offAny()
            socket.offAnyOutgoing()
            socket.close()
        },
    }
}
