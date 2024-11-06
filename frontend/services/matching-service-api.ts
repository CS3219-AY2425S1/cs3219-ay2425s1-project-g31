import axios from 'axios'
import axiosClient from './axios-middleware'
import { IMatch } from '@repo/user-types'

const axiosInstance = axiosClient.matchingServiceAPI

// POST /matching
export const addUserToMatchmaking = async (): Promise<any | undefined> => {
    try {
        return await axiosInstance.post(`/matching`)
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw { status: error.response.status, message: error.message, data: error.response.data }
            } else {
                throw { message: `Axios error: ${error.message}` }
            }
        } else {
            throw { message: 'An unexpected error occurred' }
        }
    }
}

// GET /matching
export const getMatchDetails = async (matchId: string): Promise<any | undefined> => {
    try {
        return await axiosInstance.get(`/matching/${matchId}`)
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw { message: `Axios error: ${error.message}` }
        } else {
            throw { message: 'An unexpected error occurred' }
        }
    }
}

export const getOngoingMatch = async (userId: string): Promise<IMatch | null> => {
    try {
        const res = await axiosInstance.get(`/matching/current`, {
            params: {
                userId,
            },
        })
        const match: IMatch = res.data
        return match || null
    } catch (error) {
        return null
    }
}
