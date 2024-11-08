import { FC, useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { ChatModel } from '@repo/collaboration-types'

const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()
}

const Chat: FC<{ chatData: ChatModel[]; isViewOnly: boolean; handleSendMessage: (msg: string) => void }> = ({
    chatData,
    isViewOnly,
    handleSendMessage,
}) => {
    const chatEndRef = useRef<HTMLDivElement | null>(null)
    const { data: session } = useSession()
    const [value, setValue] = useState('')

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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
            handleSendMessage(e.currentTarget.value)
            setValue('')
            e.currentTarget.value = ''
        }
    }

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [chatData])

    return (
        <>
            <div className="overflow-y-auto p-3">
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
                {(!chatData || !chatData?.length) && (
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
                        readOnly={isViewOnly}
                    />
                </div>
            )}
        </>
    )
}

export default Chat
