import 'dotenv/config';
import http, { Server } from 'http';
import config from './common/config.util';
import logger from './common/logger.util';
import connectToDatabase from './common/mongodb.util';
import index from './index';
// @ts-expect-error - Yjs is not typed
import yUtils from 'y-websocket/bin/utils';
import { Server as SocketIOServer } from 'socket.io';
import WebSocket from 'ws';
import { WebSocketConnection } from './services/socketio.service';
import { saveCode } from './models/collab.repository';

connectToDatabase(config.DB_URL);

const server: Server = http.createServer(index);
const io = new SocketIOServer(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// WebSocket setup for Yjs
const wss = new WebSocket.Server({ noServer: true });
new WebSocketConnection(3009);

yUtils.setPersistence({
    bindState: async (docName, ydoc) => {
        logger.info(`Binding state for ${docName} ${ydoc}`);
    },
    writeState: async (docName, ydoc) => {
        const code = ydoc.getText('codemirror').toString();
        await saveCode(docName, code);
        logger.info(`Storing state for ${docName} ${code}`);
    },
});

// Handle WebSocket upgrades
server.on('upgrade', (request, socket, head) => {
    const token = request.headers['sec-websocket-protocol'];
    if (!token) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
    }
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

// Handle WebSocket connections for Yjs
wss.on('connection', (ws, req) => {
    const docName = req.url.slice(1);
    yUtils.setupWSConnection(ws, req, { docName });
});

// Socket.IO chat logic
interface IMessage {
    text: string;
    name: string;
    email: string;
    socketId: string;
    roomId: string;
    time: string;
}

let roomUsers: Record<string, string[]> = {};
const sockets: Record<string, any> = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        roomUsers[roomId] = [...(roomUsers[roomId] || []), socket.id];
        io.emit('users_response', roomUsers);
    });

    socket.on('send_message', (data: IMessage) => {
        const usersInRoom = roomUsers[data.roomId] || [];
        usersInRoom.forEach((s) => {
            if (sockets[s]?.connected) {
                sockets[s].emit('receive_message', data);
            }
        });
    });

    socket.on('disconnect', () => {
        for (const [roomId, users] of Object.entries(roomUsers)) {
            if (users.includes(socket.id)) {
                roomUsers[roomId] = users.filter(id => id !== socket.id);
                const msg: IMessage = {
                    text: 'A user left the room.',
                    socketId: 'system',
                    roomId: roomId,
                    time: new Date().toISOString(),
                    name: '',
                    email: '',
                };
                users.forEach((s) => {
                    if (sockets[s]?.connected) {
                        sockets[s].emit('receive_message', msg);
                    }
                });
            }
        }
        io.emit('users_response', roomUsers);
    });

    sockets[socket.id] = socket; // Store the socket
});

// Start the server
server.listen(config.PORT, async () => {
    logger.info(`[Init] Server is listening on port ${config.PORT}`);
});
