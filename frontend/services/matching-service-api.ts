import { IPostMatching } from '@/types/matching-api'
import axios from 'axios'
import axiosClient from './axios-middleware'

const axiosInstance = axiosClient.matchingServiceAPI

type resp = { websocketID: string }

// POST /matching
export const addUserToMatchmaking = async (data: IPostMatching): Promise<any | undefined> => {
    try {
        //TODO: Change the endpoint and response body to match the API
        return await axiosInstance.post(`/matching`, data).catch((err) => console.log(err))
        // console.log(response);
        // return response
        // return {
        //     ...data,
        //     wsId: 'testing',
        //     wsUrl: 'testing',
        // }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error('An unexpected error occurred' + error.message)
        } else {
            throw new Error('An unexpected error occurred')
        }
    }
}
