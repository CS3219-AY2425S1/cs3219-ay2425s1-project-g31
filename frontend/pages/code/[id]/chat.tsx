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

const getChatBubbleFormat = (currUser: string, sessionUser: string | undefined, type: 'label' | 'text') => {
    let format = currUser === sessionUser ? 'items-end ml-5' : 'items-start text-left mr-5'

    if (type === 'text') {
        format +=
            currUser === sessionUser
                ? ' bg-theme-600 rounded-xl text-white'
                : ' bg-slate-100 rounded-xl p-2 text-slate-900'
    }
    return format
}

const Chat: FC<{ socketRef: RefObject<socketIO.Socket | null>; isViewOnly: boolean }> = ({ socketRef, isViewOnly }) => {
    const [chatData, setChatData] = useState<ChatModel[]>([])
    const [chatData, setChatData] = useState<ChatModel[]>([])
    const chatEndRef = useRef<HTMLDivElement | null>(null)
    const { data: session } = useSession()
    const router = useRouter()
    const [value, setValue] = useState('')
    const { id: roomId } = router.query

    useEffect(() => {
        const matchId = router.query.id as string
        if (!matchId) return

        const fetchChatHistory = async () => {
            const response = await getChatHistory(matchId)
            if (!response) {
                toast.error('Failed to fetch chat history')
            } else {
                setChatData(response)
            }
        }

        fetchChatHistory()
    }, [router.query.id])

    useEffect(() => {
        if (isViewOnly || !socketRef?.current) return

        if (chatData.length === 0) return

        const socket = socketRef.current

        const handleReceiveMessage = (data: ChatModel) => {
            setChatData((prev) => [...prev, data])
        }

        socket.on('receive_message', handleReceiveMessage)

        return () => {
            socket.off('receive_message', handleReceiveMessage)
        }
    }, [socketRef, chatData, isViewOnly])

    const getChatBubbleFormat = (currUser: string, type: 'label' | 'text') => {
        let format = ''
        if (currUser === session?.user.username) {
            format = 'items-end ml-5'
            if (type === 'text') {
                format += ' bg-theme-600 rounded-xl text-white'
            }
        } else {
            format = 'items-start text-left mr-5'
            if (type === 'text') {
                format += ' bg-slate-100 rounded-xl p-2 text-slate-900'
            }
        }
        return format
    }

>>>>>>> 97d2738 (fix: solve chat issue)
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
            console.log('roomId: ', roomId)
            socketRef.current.emit('send_message', msg)
        }
        setValue('')
    }

    useEffect(() => {
        if (!isViewOnly && chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [chatData, isViewOnly])

    return (
        <>
            <div className="overflow-y-auto p-3">
                {chatData.length > 0 ? (
                    chatData.map((chat, index) => (
                        <div
                            key={index}
                            className={`flex flex-col gap-1 mb-5 ${getChatBubbleFormat(chat.senderId, session?.user.username, 'label')}`}
                        >
                            <div className="flex items-center gap-2">
                                <h4 className="text-xs font-medium">{chat.senderId}</h4>
                                <span className="text-xs text-slate-400">
                                    {formatTimestamp(chat.createdAt.toString())}
                                </span>
                            </div>
                            <div
                                className={`text-sm py-2 px-3 text-balance break-words w-full ${getChatBubbleFormat(chat.senderId, session?.user.username, 'text')}`}
                            >
                                {chat.message}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="w-full text-center text-gray-400 text-sm my-1">No chat history</p>
                )}
                <div ref={chatEndRef}></div>
            </div>
            {!isViewOnly && (
                <div className="m-3 mt-0 px-3 py-1 border-[1px] rounded-xl text-sm">
                    <input
                        type="text"
                        className="w-full bg-transparent border-none focus:outline-none"
                        placeholder="Send a message..."
                        onKeyDown={handleKeyDown}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        aria-label="Send a message"
                        readOnly={isViewOnly}
                    />
                </div>
            )}
        </>
    )
}

export default Chat
