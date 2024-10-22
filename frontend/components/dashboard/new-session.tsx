'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Category, Complexity, Proficiency } from '@repo/user-types'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useRef } from 'react'
import { toast } from 'sonner'
import { addUserToMatchmaking } from '../../services/matching-service-api'
import CustomModal from '../customs/custom-modal'
import Loading from '../customs/loading'
import { WebSocketMessageType } from '@repo/ws-types'
import { IPostMatching, MatchingStatus } from '@/types/matching-api'
import { getMatchDetails } from '@/services/collaboration-service-api'

export const NewSession = () => {
    const router = useRouter()
    const socketRef = useRef<WebSocket | undefined>(undefined)

    const TopicOptions = Object.values(Category).map((category) => ({
        value: category,
        label: category.charAt(0).toUpperCase() + category.toLocaleLowerCase().slice(1),
    }))

    const ComplexityOptions = Object.values(Complexity).map((complexity) => ({
        value: complexity,
        label: complexity.charAt(0).toUpperCase() + complexity.toLocaleLowerCase().slice(1),
    }))

    const { data: session } = useSession()

    const [selectedTopic, setSelectedTopic] = React.useState('')
    const [selectedComplexity, setSelectedComplexity] = React.useState('')

    const [modalData, setModalData] = React.useState({
        isOpen: false,
        matchStatus: MatchingStatus.NOT_IN_QUEUE,
        matchId: '',
    })

    const [timeElapsed, setTimeElapsed] = React.useState(0)
    React.useEffect(() => {
        if (modalData.matchStatus === MatchingStatus.QUEUED) {
            const timer = setTimeout(() => {
                setTimeElapsed((timeElapsed) => timeElapsed + 1)
            }, 1000)

            return () => clearTimeout(timer)
        }
    }, [modalData.matchStatus, timeElapsed])

    const handleMatchmaking = async () => {
        if (!selectedTopic || !selectedComplexity) {
            toast.error('Please select a topic and complexity level to start matchmaking.')
            return
        }
        setTimeElapsed(0)
        setModalData((modalData) => ({
            ...modalData,
            isOpen: true,
            matchStatus: MatchingStatus.QUEUED,
        }))

        //TODO: Modify this response to match the response from the API
        let websocketId = ''

        try {
            const r = await addUserToMatchmaking()
            websocketId = r?.websocketID ?? ''
        } catch (e: any) {
            if (e.status === 403) {
                await updateMatchmakingStatus(MatchingStatus.MATCH_EXISTS, e.data)
            } else if (e.status === 409) {
                await updateMatchmakingStatus(MatchingStatus.USER_ALREADY_IN_QUEUE)
            } else {
                await updateMatchmakingStatus(MatchingStatus.MATCH_NOT_FOUND)
            }
            return
        }

        const socket = new WebSocket(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/?id=${websocketId}`)
        socketRef.current = socket
        socketRef.current.onclose = () => {
            updateMatchmakingStatus(MatchingStatus.MATCH_NOT_FOUND)
        }
        socketRef.current.onopen = () => {
            const data: IPostMatching = {
                userId: session?.user.id ?? '',
                proficiency: session?.user.proficiency as Proficiency,
                complexity: selectedComplexity as Complexity,
                topic: selectedTopic as Category,
                websocketId: websocketId,
            }
            socketRef.current?.send(JSON.stringify(data))
        }
        socketRef.current.onmessage = (event: MessageEvent) => {
            if (typeof event.data === 'string') {
                const newMessage = JSON.parse(event.data)
                switch (newMessage.type) {
                    case WebSocketMessageType.SUCCESS:
                        updateMatchmakingStatus(MatchingStatus.MATCH_FOUND, newMessage.matchId)
                        setTimeout(() => {
                            router.push('/code')
                        }, 3000)
                        break
                    case WebSocketMessageType.FAILURE:
                        socketRef.current?.close()
                        socketRef.current = undefined
                        updateMatchmakingStatus(MatchingStatus.MATCH_NOT_FOUND)
                        break
                    case WebSocketMessageType.CANCEL:
                        socketRef.current?.close()
                        socketRef.current = undefined
                        setModalData((modalData) => {
                            return {
                                ...modalData,
                                isOpen: false,
                                matchStatus: MatchingStatus.NOT_IN_QUEUE,
                            }
                        })
                        break
                    case WebSocketMessageType.DUPLICATE:
                        setModalData((modalData) => {
                            return {
                                ...modalData,
                                matchStatus: MatchingStatus.MATCH_EXISTS,
                            }
                        })
                        break
                    default:
                        console.error('Unexpected message type received')
                }
            } else {
                console.error('Unexpected data type received:', typeof event.data)
            }
        }

        socketRef.current.onerror = (error: Event) => {
            console.error('WebSocket Error:', error)
        }
    }

    const updateMatchmakingStatus = async (status: MatchingStatus, matchId?: string) => {
        setModalData((modalData) => ({
            ...modalData,
            matchStatus: status,
            matchId: matchId ?? modalData.matchId,
        }))
    }

    const handleCancelMatchmaking = async () => {
        const cancelMessage = { type: WebSocketMessageType.CANCEL, userId: session?.user.id }
        socketRef.current?.send(JSON.stringify(cancelMessage))
        setModalData((modalData) => ({
            ...modalData,
            isOpen: false,
            matchStatus: MatchingStatus.NOT_IN_QUEUE,
        }))
    }

    const handleJoinSession = async () => {
        try {
            await getMatchDetails(modalData.matchId)
        } catch (e) {
            toast.error('Failed to get match details. Please try again later.')
            return
        }
        router.push('/code')
    }

    return (
        <div className="border-solid border-2 border-gray-200 rounded flex flex-col w-dashboard p-6 min-h-[60vh] max-h-[90vh] overflow-auto justify-between">
            <div>
                <h5 className=" text-xl text-medium font-bold">Start a New Session</h5>
                <br />
                <p className="text-medium font-medium mb-1">
                    Choose a <strong>Topic</strong> and <strong>Complexity</strong> level to start your collaborative
                    coding session!
                </p>

                <p className="text-medium font-bold mt-6 mb-2">Topic</p>
                <Select onValueChange={(val: string) => setSelectedTopic(val as Category)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select one..." />
                    </SelectTrigger>
                    <SelectContent>
                        {TopicOptions.map(({ value, label }) => (
                            <SelectItem key={value} value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <p className="text-medium font-bold mt-6 mb-2">Complexity</p>
                <Select onValueChange={(val: string) => setSelectedComplexity(val as Complexity)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select one..." />
                    </SelectTrigger>
                    <SelectContent>
                        {ComplexityOptions.map(({ value, label }) => (
                            <SelectItem key={value} value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Button className="mt-4 bg-purple-600 hover:bg-[#A78BFA]" onClick={handleMatchmaking}>
                Start matchmaking
            </Button>

            {modalData.isOpen && (
                <CustomModal className={`h-auto w-2/5 rounded-lg items-center`}>
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <Image
                            priority={true}
                            src="/matchmaking.png"
                            width={343}
                            height={234}
                            alt="pros sitting around a monitor"
                        />
                        {modalData.matchStatus === MatchingStatus.QUEUED && (
                            <>
                                <h2 className="text-xl font-bold text-center">Finding collaborator</h2>
                                <Loading />
                                <h2 className="text-medium font-medium">
                                    {`${Math.floor(timeElapsed / 60)}:${(timeElapsed % 60).toString().padStart(2, '0')}`}
                                </h2>
                                <Button variant={'primary'} size={'lg'} onClick={handleCancelMatchmaking}>
                                    Cancel matchmaking
                                </Button>
                            </>
                        )}
                        {modalData.matchStatus === MatchingStatus.USER_ALREADY_IN_QUEUE && (
                            <>
                                <h2 className="text-xl font-bold text-center">User already in queue.</h2>
                                <Button variant={'ghostTabLabel'} size={'lg'} onClick={handleCancelMatchmaking}>
                                    Cancel
                                </Button>
                            </>
                        )}
                        {modalData.matchStatus === MatchingStatus.MATCH_NOT_FOUND && (
                            <>
                                <h2 className="text-xl font-bold text-center">
                                    Failed to find a collaborator. Would you like to try again?
                                </h2>
                                <div className="flex flex-row space-x-4">
                                    <Button variant={'primary'} size={'lg'} onClick={handleMatchmaking}>
                                        Retry
                                    </Button>
                                    <Button variant={'ghostTabLabel'} size={'lg'} onClick={handleCancelMatchmaking}>
                                        Cancel
                                    </Button>
                                </div>
                            </>
                        )}
                        {modalData.matchStatus === MatchingStatus.MATCH_FOUND && (
                            <>
                                <h2 className="text-xl font-bold text-center">Match found!</h2>
                                <h3 className="text-md font-bold text-center">
                                    Please wait while we redirect you to the coding session...
                                </h3>
                            </>
                        )}
                        {modalData.matchStatus === MatchingStatus.MATCH_EXISTS && (
                            <>
                                <h2 className="text-xl font-bold text-center">You already have a match!</h2>
                                <Button variant={'ghostTabLabel'} size={'lg'} onClick={handleJoinSession}>
                                    Proceed to coding session
                                </Button>
                            </>
                        )}
                    </div>
                </CustomModal>
            )}
        </div>
    )
}
