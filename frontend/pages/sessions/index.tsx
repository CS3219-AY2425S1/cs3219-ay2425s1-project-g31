import { IGetSessions, IPagination, ISession, ISortBy, SessionManager, SortDirection } from '@/types'
import { useEffect, useState } from 'react'

import Datatable from '@/components/customs/datatable'
import Loading from '@/components/customs/loading'
import useProtectedRoute from '@/hooks/UseProtectedRoute'
import { columns } from './columns'
import { toast } from 'sonner'
import { getSessionsRequest } from '@/services/session-service-api'

export default function Sessions() {
    const [data, setData] = useState<ISession[]>([])
    const [pagination, setPagination] = useState<IPagination>({
        totalPages: 10,
        currentPage: 1,
        totalItems: 96,
        limit: 10,
    })
    const [sortBy, setSortBy] = useState({
        sortKey: 'id',
        direction: SortDirection.NONE,
    })

    useEffect(() => {
        loadData()
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
            toast.error('Failed to fetch questions: ' + error)
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

    if (loading)
        return (
            <div className="flex flex-col h-screen w-screen items-center justify-center">
                <Loading />
            </div>
        )

    return (
        <div className="m-8">
            <h2 className="text-xl font-bold mb-4">Sessions</h2>
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
        </div>
    )
}
