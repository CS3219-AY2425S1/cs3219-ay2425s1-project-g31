import { useEffect, useRef, useState } from 'react'

import { mockUserData } from '@/mock-data'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import * as socketIO from 'socket.io-client'

interface ICollaborator {
    name: string
    email: string
}

const userData: ICollaborator = mockUserData

const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()
}

export interface IMessage {
    text: string
    name: string
    email: string
    socketId: string
    roomId: string
    time: string
}

const Chat = () => {
    const [chatData, setChatData] = useState<IMessage[]>()
    const [socket, setSocket] = useState<socketIO.Socket>()
    const chatEndRef = useRef<HTMLDivElement | null>(null)
    const { data: session } = useSession()
    const router = useRouter()
    const [value, setValue] = useState('')
    const { id: roomId } = router.query

    useEffect(() => {
        if (!session || !roomId) {
            router.replace('/')
            return
        }
        if (!socket) {
            const s = socketIO.connect('ws://localhost:3010')
            s.emit('join_room', roomId)
            s.on('receive_message', (data: IMessage) => {
                console.log('Got a msg', data)
                setChatData((prev) => {
                    return [...(prev ?? []), data]
                })
            })
            setSocket(s)
        }
    }, [router, session])

    const getChatBubbleFormat = (currUser: ICollaborator, type: 'label' | 'text') => {
        let format = ''
        if (currUser.email === userData.email) {
            format = 'items-end ml-5'
            // Add more format based on the type
            if (type === 'text') {
                format += ' bg-theme-600 rounded-xl text-white'
            }
        } else {
            format = 'items-start text-left mr-5'
            // Add more format based on the type
            if (type === 'text') {
                format += ' bg-slate-100 rounded-xl p-2 text-slate-900'
            }
        }

        return format
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
            handleSendMessage(e.currentTarget.value)
            e.currentTarget.value = ''
        }
    }

    const handleSendMessage = (message: string) => {
        if (!session || !socket) return

        if (message.trim()) {
            const msg: IMessage = {
                text: message,
                name: session.user.username,
                time: new Date().toString(),
                socketId: socket.id || '',
                roomId: roomId as string,
                email: session.user.email,
            }
            socket.emit('send_message', msg)
        }
        setValue('')
    }

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [chatData])

    return (
        <>
            <div className="overflow-y-auto p-3 pb-0">
                {!!chatData?.length &&
                    Object.values(chatData).map((chat, index) => (
                        <div
                            key={index}
                            className={`flex flex-col gap-1 mb-5 ${getChatBubbleFormat({ name: chat.name, email: chat.email }, 'label')}`}
                        >
                            <div className="flex items-center gap-2">
                                <h4 className="text-xs font-medium">{chat.name}</h4>
                                <span className="text-xs text-slate-400">{formatTimestamp(chat.time)}</span>
                            </div>
                            <div
                                className={`text-sm py-2 px-3 text-balance break-words w-full ${getChatBubbleFormat({ name: chat.name, email: chat.email }, 'text')}`}
                            >
                                {chat.text}
                            </div>
                        </div>
                    ))}
                <div ref={chatEndRef}></div>
            </div>
            <div className="m-3 px-3 py-1 border-[1px] rounded-xl text-sm">
                <input
                    type="text"
                    className="w-full bg-transparent border-none focus:outline-none"
                    placeholder="Send a message..."
                    onKeyDown={handleKeyDown}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </div>
        </>
    )
}

export default Chat
