'use client'

import { NewSession } from '@/components/dashboard/new-session'
import { ProgressCard } from '@/components/dashboard/progress-card'
import { RecentSessions } from '@/components/dashboard/recent-sessions'
import { useEffect, useState } from 'react'

export default function Home() {
    const progressData = [
        {
            difficulty: 'Easy',
            score: '10/20',
            progress: 50,
            indicatorColor: 'bg-green-700',
            backgroundColor: 'bg-green-500',
        },
        {
            difficulty: 'Medium',
            score: '15/27',
            progress: 60,
            indicatorColor: 'bg-amber-500',
            backgroundColor: 'bg-amber-300',
        },
        {
            difficulty: 'Hard',
            score: '5/19',
            progress: 20,
            indicatorColor: 'bg-red-500',
            backgroundColor: 'bg-red-400',
        },
    ]

    const [username, setUsername] = useState('')

    useEffect(() => {
        setUsername(sessionStorage.getItem('username') ?? '')
    }, [])

    return (
        <div className="my-4">
            <h2 className="text-xl font-bold my-6">Welcome Back, {username}</h2>
            <div className="flex flex-row justify-evenly -mx-2">
                {progressData.map(({ difficulty, score, progress, indicatorColor, backgroundColor }, index) => (
                    <ProgressCard
                        key={index}
                        difficulty={difficulty}
                        score={score}
                        progress={progress}
                        indicatorColor={indicatorColor}
                        backgroundColor={backgroundColor}
                    />
                ))}
            </div>
            <div className="flex flex-row justify-between my-4">
                <NewSession />
                <RecentSessions />
            </div>
        </div>
    )
}
