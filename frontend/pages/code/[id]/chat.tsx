import { FC, RefObject, useEffect, useRef, useState } from 'react'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import * as socketIO from 'socket.io-client'
import { getChatHistory } from '@/services/collaboration-service-api'
import { ChatModel } from '@repo/collaboration-types'
import { toast } from 'sonner'

const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()
}

const Chat: FC<{ socketRef: RefObject<socketIO.Socket | null> }> = ({ socketRef }) => {
    const [chatData, setChatData] = useState<ChatModel[]>()
    const chatEndRef = useRef<HTMLDivElement | null>(null)
    const { data: session } = useSession()
    const router = useRouter()
    const [value, setValue] = useState('')
    const { id: roomId } = router.query

    useEffect(() => {
        ;(async () => {
            const matchId = router.query.id as string
            if (!matchId) {
                return
            }
            const response = await getChatHistory(matchId)
            if (!response) {
                toast.error('Failed to fetch chat history')
            }
            setChatData(response)
        })()
    }, [router])

    useEffect(() => {
        if (socketRef?.current) {
            socketRef.current.on('receive_message', (data: ChatModel) => {
                console.log('Got a msg', data)
                setChatData((prev) => {
                    return [...(prev ?? []), data]
                })
            })
        }
    }, [socketRef])

    const getChatBubbleFormat = (currUser: string, type: 'label' | 'text') => {
        let format = ''
        if (currUser === session?.user.username) {
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
        if (!session || !socketRef?.current) return

        if (message.trim()) {
            const msg: ChatModel = {
                message: message,
                senderId: session.user.username,
                createdAt: new Date(),
                roomId: roomId as string,
            }
            socketRef.current.emit('send_message', msg)
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
                            className={`flex flex-col gap-1 mb-5 ${getChatBubbleFormat(chat.senderId, 'label')}`}
                        >
                            <div className="flex items-center gap-2">
                                <h4 className="text-xs font-medium">{chat.senderId}</h4>
                                <span className="text-xs text-slate-400">
                                    {formatTimestamp(chat.createdAt.toString())}
                                </span>
                            </div>
                            <div
                                className={`text-sm py-2 px-3 text-balance break-words w-full ${getChatBubbleFormat(chat.senderId, 'text')}`}
                            >
                                {chat.message}
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
