'use client'

import ConfirmDialog, { ConfirmDialogProps } from '@/components/customs/confirm-dialog'
import Loading from '@/components/customs/loading'
import { NewSession } from '@/components/dashboard/new-session'
import { ProgressCard } from '@/components/dashboard/progress-card'
import { RecentSessions } from '@/components/dashboard/recent-sessions'
import ResumeSession from '@/components/dashboard/resume-session'
import useProtectedRoute from '@/hooks/UseProtectedRoute'
import { getOngoingMatch } from '@/services/matching-service-api'
import { IMatch } from '@repo/user-types'
import { useEffect, useState } from 'react'

export default function Home() {
    const progressData = [
        {
            complexity: 'Easy',
            score: '10/20',
            progress: 50,
            indicatorColor: 'bg-green-700',
            backgroundColor: 'bg-green-500',
        },
        {
            complexity: 'Medium',
            score: '15/27',
            progress: 60,
            indicatorColor: 'bg-amber-500',
            backgroundColor: 'bg-amber-300',
        },
        {
            complexity: 'Hard',
            score: '5/19',
            progress: 20,
            indicatorColor: 'bg-red-500',
            backgroundColor: 'bg-red-400',
        },
    ]

    const { session, loading } = useProtectedRoute()
    const [ongoingMatchData, setOngoingMatchData] = useState<IMatch | null>()
    const [dialog, setDialog] = useState<ConfirmDialogProps>({
        dialogData: {
            isOpen: false,
            title: 'Session Over',
            content: 'Uh oh, looks like the collaborator has left the session. Please start a new session!',
        },
        closeHandler: () => {
            handleConfirmSessionOver()
        },
        confirmHandler: () => {
            handleConfirmSessionOver()
        },
        showCancelButton: false,
    })

    const checkOngoingSession = async () => {
        if (!session?.user?.id) return
        const matchData = await getOngoingMatch(session.user.id)
        setOngoingMatchData(matchData || null)
    }

    const handleIsOngoing = async () => {
        try {
            if (!session?.user?.id) return false
            const matchData = await getOngoingMatch(session?.user?.id)
            if (!matchData) {
                setDialog((prev) => ({ ...prev, dialogData: { ...prev.dialogData, isOpen: true } }))
            }
            return !!matchData
        } catch (error) {
            return false
        }
    }

    const handleConfirmSessionOver = () => {
        setDialog((prev) => ({ ...prev, dialogData: { ...prev.dialogData, isOpen: false } }))
        setOngoingMatchData(null)
    }

    useEffect(() => {
        checkOngoingSession()
    }, [])

    if (loading)
        return (
            <div className="flex flex-col h-screen w-screen items-center justify-center">
                <Loading />
            </div>
        )

    return (
        <div className="my-4">
            <h2 className="text-xl font-bold my-6">Welcome Back, {session?.user.username}</h2>
            <div className="flex flex-row justify-evenly -mx-2">
                {progressData.map(({ complexity, score, progress, indicatorColor, backgroundColor }, index) => (
                    <ProgressCard
                        key={index}
                        complexity={complexity}
                        score={score}
                        progress={progress}
                        indicatorColor={indicatorColor}
                        backgroundColor={backgroundColor}
                    />
                ))}
            </div>
            <div className="flex flex-row justify-between my-4">
                {ongoingMatchData ? (
                    <ResumeSession match={ongoingMatchData} isOngoing={handleIsOngoing} />
                ) : (
                    <NewSession />
                )}
                <RecentSessions />
            </div>
            <ConfirmDialog {...dialog} />
        </div>
    )
}
