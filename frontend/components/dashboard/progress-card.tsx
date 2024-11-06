'use client'

import { Progress } from '@/components/ui/progress'
import { Complexity } from '@repo/question-types'

interface ProgressCardProps {
    complexity: Complexity
    completed: number
    total: number
    progress: number
    indicatorColor: string
    backgroundColor: string
}

export const ProgressCard = ({
    complexity,
    completed,
    total,
    progress,
    indicatorColor,
    backgroundColor,
}: ProgressCardProps) => {
    return (
        <div className="border-solid border-2 border-gray-200 rounded flex flex-col w-2/6 mx-2 p-6">
            <p className="text-medium font-medium">{complexity}</p>
            <h4 className="text-4xl font-extrabold mb-4">{`${completed}/${total}`}</h4>
            <Progress value={progress} indicatorColor={indicatorColor} backgroundColor={backgroundColor} />
        </div>
    )
}
