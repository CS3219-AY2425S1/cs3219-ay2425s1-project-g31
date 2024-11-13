import { ChatModel, ICollabDto } from '@repo/collaboration-types'
import axiosClient from './axios-middleware'

const axiosInstance = axiosClient.collaborationServiceAPI

export const getChatHistory = async (matchId: string): Promise<ChatModel[] | undefined> => {
    try {
        const response: ChatModel[] = await axiosInstance.get(`/collab/chat/${matchId}`)
        return response
    } catch (error) {
        console.error(error)
    }
}

export const getCollabHistory = async (matchId: string): Promise<ICollabDto | undefined> => {
    try {
        const response: ICollabDto = await axiosInstance.get(`/collab/${matchId}`)
        return response
    } catch (error) {
        console.error(error)
    }
}
