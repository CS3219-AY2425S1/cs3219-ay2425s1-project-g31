import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3003',
})

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

export default api
