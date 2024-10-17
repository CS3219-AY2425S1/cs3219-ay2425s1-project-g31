import { IPostMatching } from '@/types/matching-api'
import axios from 'axios'

// const axiosInstance = axiosClient.matchingServiceAPI

// POST /matching
export const addUserToMatchmaking = async (
    data: IPostMatching
): Promise<{ wsId: string; wsUrl: string } | undefined> => {
    try {
        //TODO: Change the endpoint and response body to match the API
        // const response = await axiosInstance.post(`/matching`, data)
        return {
            ...data,
            wsId: 'testing',
            wsUrl: 'testing',
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error('An unexpected error occurred' + error.message)
        } else {
            throw new Error('An unexpected error occurred')
        }
    }
}
