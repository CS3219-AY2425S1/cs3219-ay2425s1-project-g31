import { Action, IGetSessions, IGetSessionsDto, ISessionsApi, SortDirection } from '@/types'
import axiosClient from './axios-middleware'

const axiosInstance = axiosClient.matchingServiceAPI

export const api = async <T>(type: Action, url: string, body: unknown) => {
    try {
        let response: T
        switch (type) {
            case Action.GET:
                response = await axiosInstance.get(url, {
                    params: body,
                })
                break
            case Action.POST:
                response = await axiosInstance.post(url, body)
                break
            case Action.PUT:
                response = await axiosInstance.put(url, body)
                break
            case Action.DELETE:
                response = await axiosInstance.delete(url)
                break
        }
        return response
    } catch (error) {
        throw new Error('An error occurred: ' + error)
    }
}

export const getSessionsRequest = async (data: IGetSessions, userId: string) => {
    let params: IGetSessionsDto = {
        page: data.page == 0 ? 1 : data.page,
        limit: data.limit,
        userId,
    }
    if (data.sortBy && data.sortBy.direction !== SortDirection.NONE) {
        params = { ...params, sortBy: `${data.sortBy.sortKey}:${data.sortBy.direction}` }
    }
    return api<ISessionsApi>(Action.GET, '/matching/', params)
}
