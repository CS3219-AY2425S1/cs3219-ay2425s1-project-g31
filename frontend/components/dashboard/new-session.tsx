'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Category, Complexity, Proficiency } from '@repo/user-types'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import { toast } from 'sonner'
import { addUserToMatchmaking } from '../../services/matching-service-api'
import CustomModal from '../customs/custom-modal'
import Loading from '../customs/loading'

export const NewSession = () => {
    const router = useRouter()

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
    const [timestamp, setTimestamp] = React.useState('')

    const [modalData, setModalData] = React.useState({
        isOpen: false,
        isMatchmaking: false,
        isMatchFound: false,
        isMatchmakingFailed: false,
    })

    const [timeElapsed, setTimeElapsed] = React.useState(0)
    React.useEffect(() => {
        if (modalData.isMatchmaking) {
            const timer = setTimeout(() => {
                setTimeElapsed((timeElapsed) => timeElapsed + 1)
            }, 1000)

            return () => clearTimeout(timer)
        }
    }, [modalData.isMatchmaking, timeElapsed])

    // const socketRef = useRef(undefined)

    const handleMatchmaking = async () => {
        if (!selectedTopic || !selectedComplexity) {
            toast.error('Please select a topic and complexity level to start matchmaking.')
            return
        }
        setTimeElapsed(0)
        setModalData((modalData) => ({
            ...modalData,
            isOpen: true,
            isMatchmaking: true,
            isMatchFound: false,
            isMatchmakingFailed: false,
        }))

        //TODO: Modify this response to match the response from the API
        let response: { wsId: string } | undefined

        try {
            setTimestamp(new Date().toISOString())
            response = await addUserToMatchmaking({
                userId: session?.user.id ?? '',
                proficiency: session?.user.proficiency as Proficiency,
                complexity: selectedComplexity as Complexity,
                topic: selectedTopic as Category,
                timestamp: timestamp,
            })
        } catch {
            await handleFailedMatchmaking()
        }

        //TODO: Add WS logic here open on connection and register handlers for match found and failed match
        // const socket = new WebSocket(`wss://${response?.wsUrl}`)
        // socketRef.current = socket
        // socketRef.current.addEventListener("fail", (event) => {
        //     socketRef.current.close()
        //     socketRef.current = undefined
        //     await handleFailedMatchmaking()
        // })
        // socketRef.current.addEventListener('success', (event) => {
        //     const matchId = event.data.matchId
        //     socketRef.current.close()
        //     socketRef.current = undefined
        //     await handleMatchFound(matchId)
        // })
        // socketRef.current.send("ready")

        //This is a mock implementation to show the modal for 10 seconds and then either show the match found modal or failed matchmaking modal
        await new Promise((resolve, _) => setTimeout(resolve, 10000))
        const isMatchFound = Math.random() > 0.5

        if (isMatchFound) {
            await handleMatchFound()
        } else {
            await handleFailedMatchmaking()
        }
    }

    const handleFailedMatchmaking = async () => {
        setModalData((modalData) => ({
            ...modalData,
            isMatchmaking: false,
            isMatchmakingFailed: true,
        }))
    }

    const handleCancelMatchmaking = async () => {
        //TODO: Add logic to call API to blacklist user/ remove user from matchmaking queue here
        // socketRef.current.send("cancel")
        // socketRef.current.close()
        // socketRef.current = undefined

        setModalData((modalData) => {
            return {
                ...modalData,
                isOpen: false,
                isMatchmaking: false,
            }
        })
    }

    const handleMatchFound = async () => {
        setModalData((modalData) => ({
            ...modalData,
            isMatchFound: true,
            isMatchmaking: false,
        }))
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
                        {modalData.isMatchmaking && (
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
                        {modalData.isMatchmakingFailed && (
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
                        {modalData.isMatchFound && (
                            <h2 className="text-xl font-bold text-center">
                                Match found! Please wait while we redirect you to the coding session...
                            </h2>
                        )}
                    </div>
                </CustomModal>
            )}
        </div>
    )
}
