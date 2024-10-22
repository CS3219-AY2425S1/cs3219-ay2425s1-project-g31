import axios from 'axios'
import axiosClient from './axios-middleware'

const axiosInstance = axiosClient.collaborationServiceAPI

// POST /collab
export const addUserToMatchmaking = async (matchId: string): Promise<any | undefined> => {
    try {
        return await axiosInstance.post(`/collab`, { matchId })
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.message)
        } else {
            throw new Error('An unexpected error occurred')
        }
    }
}
