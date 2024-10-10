'use client'

import { Progress } from '@/components/ui/progress'

interface ProgressCardProps {
    difficulty: string
    score: string
    progress: number
    indicatorColor: string
    backgroundColor: string
}

export const ProgressCard = ({ difficulty, score, progress, indicatorColor, backgroundColor }: ProgressCardProps) => {
    return (
        <div className="border-solid border-2 border-gray-200 rounded flex flex-col w-2/6 mx-2 p-6">
            <p className="text-medium font-medium">{difficulty}</p>
            <h4 className="text-4xl font-extrabold mb-4">{score}</h4>
            <Progress value={progress} indicatorColor={indicatorColor} backgroundColor={backgroundColor} />
        </div>
    )
}
