import axios from 'axios'

const api = axios.create({
    baseURL: process.env.USER_SERVICE_URL,
    // baseURL: 'http://localhost:3002',
})

// Request interceptor for all axios calls
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('accessToken')
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        console.log(config.baseURL)
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor for all axios calls
api.interceptors.response.use(
    (response) => {
        const token = response.data?.accessToken

        if (token) {
            sessionStorage.setItem('accessToken', token)
        }

        return response.data
    },
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 403: // Forbidden
                    console.error('Access denied. You do not have permission to access this resource.')
                    break
                case 500:
                    throw new Error('Failed to connect to server, please try again!')
            }
        }
        return Promise.reject(error)
    }
)

export default api
