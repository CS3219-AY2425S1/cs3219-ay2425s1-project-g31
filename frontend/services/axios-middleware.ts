import axios from 'axios'
import { getSession } from 'next-auth/react'

const userServiceAPI = axios.create({
    baseURL: process.env.NEXT_PUBLIC_USER_SERVICE_URL,
})

const questionServiceAPI = axios.create({
    baseURL: process.env.NEXT_PUBLIC_QUESTION_SERVICE_URL,
})

userServiceAPI.interceptors.request.use(
    async (config) => {
        const session = await getSession()
        if (session) {
            config.headers['Authorization'] = `Bearer ${session.user.accessToken}`
        }
        console.log(config.baseURL)
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

userServiceAPI.interceptors.response.use(
    (response) => {
        return response.data
    },
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 403:
                    console.error('Access denied. You do not have permission to access this resource.')
                    break
                case 500:
                    throw new Error('Failed to connect to server, please try again!')
            }
        }
        return Promise.reject(error)
    }
)

questionServiceAPI.interceptors.request.use(
    async (config) => {
        const session = await getSession()
        if (session) {
            config.headers['Authorization'] = `Bearer ${session.user.accessToken}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

questionServiceAPI.interceptors.response.use(
    (response) => {
        return response.data
    },
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 403:
                    console.error('Access denied. You do not have permission to access this resource.')
                    break
                case 500:
                    throw new Error('Failed to connect to server, please try again!')
            }
        }
        return Promise.reject(error)
    }
)

export default { userServiceAPI, questionServiceAPI }
