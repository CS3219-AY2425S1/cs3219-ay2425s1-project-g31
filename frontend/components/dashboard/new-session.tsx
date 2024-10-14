'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Category, Complexity, Proficiency } from '@repo/user-types'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React from 'react'
import { toast } from 'sonner'
import { addUserToMatchmaking } from '../../services/matching-service-api'
import CustomModal from '../customs/custom-modal'
import Loading from '../customs/loading'

export const NewSession = () => {
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
        isMatchmaking: false,
        isMatchFound: false,
    })
    const [timeElapsed, setTimeElapsed] = React.useState(0)
    React.useEffect(() => {
        if (modalData.isMatchmaking) {
            const timer = setTimeout(() => {
                setTimeElapsed(timeElapsed + 1)
            }, 1000)

            return () => clearTimeout(timer)
        }
    }, [modalData.isMatchmaking, timeElapsed])

    const handleMatchmaking = async () => {
        if (!selectedTopic || !selectedComplexity) {
            toast.error('Please select a topic and complexity level to start matchmaking.')
            return
        }
        setTimeElapsed(0)
        setModalData({
            isOpen: true,
            isMatchFound: false,
            isMatchmaking: true,
        })

        //TODO: Modify this response to match the response from the API
        let response: { wsId: string } | undefined

        try {
            response = await addUserToMatchmaking({
                userId: session?.user.id ?? '',
                proficiency: session?.user.proficiency as Proficiency,
                complexity: selectedComplexity as Complexity,
                topic: selectedTopic as Category,
            })
        } catch {
            toast.error('Failed to add to matchmaking queue. Please try again later.')
            setModalData({
                isOpen: false,
                isMatchmaking: false,
                isMatchFound: false,
            })
            return
        }

        toast.success('Successfully added to the matchmaking queue.')
        //TODO: Add WS logic here to listen for match found events
        await new Promise((resolve, _) => setTimeout(resolve, 10000))
        await handleMatchFound()
    }

    const handleCancelMatchmaking = async () => {
        setModalData({
            isOpen: false,
            isMatchmaking: false,
            isMatchFound: false,
        })
        //TODO: Add logic to call API to blacklist user/ remove user from matchmaking queue here
    }

    const handleMatchFound = async () => {
        setModalData({
            isOpen: true,
            isMatchFound: true,
            isMatchmaking: false,
        })
        //TODO: Add routing to collaborative coding page here
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
                <CustomModal className={`h-3/5 w-2/5 rounded-lg`}>
                    <div className="flex flex-col items-center justify-center">
                        <Image
                            priority={true}
                            src="/matchmaking.png"
                            width={343}
                            height={234}
                            alt="pros sitting around a monitor"
                        />
                        <h2 className="text-xl font-bold mt-6 mb-4">
                            {modalData.isMatchmaking ? 'Finding collaborator' : 'Match found!'}
                        </h2>
                        {modalData.isMatchmaking && <Loading />}
                        {modalData.isMatchmaking && (
                            <h2 className="text-medium font-medium mt-2">
                                {`${Math.floor(timeElapsed / 60)}:${(timeElapsed % 60).toString().padStart(2, '0')}`}
                            </h2>
                        )}
                        <Button
                            className="mt-4 bg-purple-600 hover:bg-[#A78BFA]"
                            variant={'primary'}
                            size={'lg'}
                            onClick={handleCancelMatchmaking}
                        >
                            Cancel matchmaking
                        </Button>
                    </div>
                </CustomModal>
            )}
        </div>
    )
}
