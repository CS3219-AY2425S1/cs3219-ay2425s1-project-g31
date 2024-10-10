import { IPagination, ISession, ISortBy, SortDirection } from '@/types'
import { useEffect, useState } from 'react'

import Datatable from '@/components/customs/datatable'
import Loading from '@/components/customs/loading'
import { columns } from './columns'
import { mockSessionsData } from '@/mock-data'
import useProtectedRoute from '@/hooks/UseProtectedRoute'

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
        // Fetch data from BE API
        async function fetchData() {
            const result = mockSessionsData
            setData(result)
        }
        fetchData()
    }, [])

    const paginationHandler = (page?: number, limit?: number) => {}

    const sortHandler = (sortBy: ISortBy) => {
        setSortBy(sortBy)
    }

    const { loading } = useProtectedRoute()

    if (loading) return <Loading />

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
