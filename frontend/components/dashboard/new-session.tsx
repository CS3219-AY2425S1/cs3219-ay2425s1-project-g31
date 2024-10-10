'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { Button } from '@/components/ui/button'

export const NewSession = () => {
    const TopicOptions = [
        {
            value: 'strings',
            label: 'Strings',
        },
        {
            value: 'arrays',
            label: 'Arrays',
        },
        {
            value: 'linked-lists',
            label: 'Linked Lists',
        },
    ]

    const DifficultyOptions = [
        {
            value: 'easy',
            label: 'Easy',
        },
        {
            value: 'medium',
            label: 'Medium',
        },
        {
            value: 'difficult',
            label: 'Difficult',
        },
    ]

    return (
        <div className="border-solid border-2 border-gray-200 rounded flex flex-col w-dashboard p-6 min-h-[60vh] max-h-[90vh] overflow-auto justify-between">
            <div>
                <h5 className=" text-xl text-medium font-bold">Start a New Session</h5>
                <br />
                <p className="text-medium font-medium mb-1">
                    Choose a <strong>Topic</strong> and <strong>Difficulty</strong> level to start your collaborative
                    coding session!
                </p>

                <p className="text-medium font-bold mt-6 mb-2">Topic</p>
                <Select>
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

                <p className="text-medium font-bold mt-6 mb-2">Difficulty</p>
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Select one..." />
                    </SelectTrigger>
                    <SelectContent>
                        {DifficultyOptions.map(({ value, label }) => (
                            <SelectItem key={value} value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Button className="mt-4 bg-purple-600 hover:bg-[#A78BFA]">Start matchmaking</Button>
        </div>
    )
}
