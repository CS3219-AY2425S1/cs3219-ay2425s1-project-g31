import { IPostMatching } from '@/types/matching-api'
import axios from 'axios'
import axiosClient from './axios-middleware'

const axiosInstance = axiosClient.matchingServiceAPI

type resp = { websocketID: string }

// POST /matching
export const addUserToMatchmaking = async (): Promise<any | undefined> => {
    try {
        return await axiosInstance.post(`/matching`).catch((err) => console.log(err))
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error('An unexpected error occurred' + error.message)
        } else {
            throw new Error('An unexpected error occurred')
        }
    }
}
