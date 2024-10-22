import axios from 'axios'
import axiosClient from './axios-middleware'

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
