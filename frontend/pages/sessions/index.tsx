import { IGetSessions, IPagination, ISession, ISortBy, SessionManager, SortDirection } from '@/types'
import { useEffect, useState } from 'react'

import Datatable from '@/components/customs/datatable'
import Loading from '@/components/customs/loading'
import useProtectedRoute from '@/hooks/UseProtectedRoute'
import { columns } from './columns'
import { toast } from 'sonner'
import { getSessionsRequest } from '@/services/session-service-api'
import { Button } from '@/components/ui/button'
import ConfirmDialog, { ConfirmDialogProps } from '@/components/customs/confirm-dialog'
import { getOngoingMatch } from '@/services/matching-service-api'
import { useRouter } from 'next/router'
import { encodeStr } from '@/util/encryption'

export default function Sessions() {
    const router = useRouter()
    const [data, setData] = useState<ISession[]>([])
    const [pagination, setPagination] = useState<IPagination>({
        totalPages: 1,
        currentPage: 1,
        totalItems: 0,
        limit: 5,
    })
    const [sortBy, setSortBy] = useState({
        sortKey: 'id',
        direction: SortDirection.NONE,
    })
    const [ongoingSession, setOngoingSession] = useState<string>('')
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

    const handleConfirmSessionOver = () => {
        setDialog((prev) => ({ ...prev, dialogData: { ...prev.dialogData, isOpen: false } }))
        setOngoingSession('')
    }

    useEffect(() => {
        loadData()
        checkOngoingSession()
    }, [])

    const { session, loading } = useProtectedRoute()

    const paginationHandler = (page: number, limit: number) => {
        const body = {
            page: page,
            limit: limit,
            sortBy: sortBy,
        }
        load(body)
    }

    const sortHandler = (sortBy: ISortBy) => {
        setSortBy(sortBy)
        const body: IGetSessions = {
            page: pagination.currentPage,
            limit: pagination.limit,
            sortBy: sortBy,
        }
        load(body)
    }

    const load = async (body: IGetSessions) => {
        try {
            if (!session || !session?.user) return
            const res = await getSessionsRequest(body, session?.user.id)
            if (res) {
                const sessions = SessionManager.fromDto(res.sessions, session?.user.username)
                setData(sessions)
                if (res.pagination.currentPage > res.pagination.totalPages && res.pagination.totalPages > 0) {
                    body.page = res.pagination.totalPages
                    load(body)
                }
                setPagination(res.pagination)
            }
        } catch (error) {
            toast.error('Failed to fetch sessions: ' + error)
        }
    }

    const loadData = async () => {
        const body: IGetSessions = {
            page: pagination.currentPage,
            limit: pagination.limit,
            sortBy: sortBy,
        }
        await load(body)
    }

    const checkOngoingSession = async () => {
        if (!session?.user?.id) return
        const matchData = await getOngoingMatch(session.user.id)
        if (matchData) {
            setOngoingSession(matchData.id)
        }
    }

    const handleResume = async () => {
        if (!session?.user?.id) return
        const matchData = await getOngoingMatch(session.user.id)
        if (matchData) {
            const encodedId = encodeStr(matchData.id)
            router.push(`/code/${encodedId}`)
        } else {
            setDialog((prev) => ({ ...prev, dialogData: { ...prev.dialogData, isOpen: true } }))
        }
    }

    if (loading)
        return (
            <div className="flex flex-col h-screen w-screen items-center justify-center">
                <Loading />
            </div>
        )

    return (
        <div className="m-8">
            <div className="flex justify-between mb-4 items-center">
                <h2 className="text-xl font-bold">Sessions</h2>
                {ongoingSession && (
                    <Button variant="primary" onClick={handleResume}>
                        Resume
                    </Button>
                )}
            </div>
            <Datatable
                data={data}
                columns={columns}
                hideIdx={false}
                pagination={pagination}
                paginationHandler={paginationHandler}
                sortBy={sortBy}
                sortHandler={sortHandler}
                actionsHandler={() => {}}
            />
            <ConfirmDialog {...dialog} />
        </div>
    )
}
