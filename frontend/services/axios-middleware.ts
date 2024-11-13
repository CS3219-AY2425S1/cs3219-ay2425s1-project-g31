import axios from 'axios'
import { getSession } from 'next-auth/react'

const createServiceAPI = (baseURL: string) => {
    const api = axios.create({ baseURL })

    api.interceptors.request.use(
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

    api.interceptors.response.use(
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

    return api
}

const userServiceAPI = createServiceAPI(process.env.NEXT_PUBLIC_API_URL?.concat('/api') ?? 'http://localhost:3002')
const questionServiceAPI = createServiceAPI(process.env.NEXT_PUBLIC_API_URL?.concat('/api') ?? 'http://localhost:3004')
const matchingServiceAPI = createServiceAPI(process.env.NEXT_PUBLIC_API_URL?.concat('/api') ?? 'http://localhost:3006')
const collaborationServiceAPI = createServiceAPI(
    process.env.NEXT_PUBLIC_API_URL?.concat('/api') ?? 'http://localhost:3008'
)

export default { userServiceAPI, questionServiceAPI, matchingServiceAPI, collaborationServiceAPI }
