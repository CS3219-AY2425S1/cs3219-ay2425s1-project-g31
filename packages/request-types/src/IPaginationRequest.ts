import type { Request } from 'express'

export interface IPaginationRequest
    extends Request<
        object,
        object,
        object,
        {
            page: string
            limit: string
        }
    > {
    query: {
        page: string
        limit: string
        sortBy: string | undefined
        filterBy: string | undefined
    }
}
