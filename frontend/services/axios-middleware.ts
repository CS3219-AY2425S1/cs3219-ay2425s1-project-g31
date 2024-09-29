import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3002',
})

// Request interceptor for all axios calls
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken')
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        console.log(config)

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
            localStorage.setItem('accessToken', token)
        }

        return response.data
    },
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 403: // Forbidden
                    console.error('Access denied. You do not have permission to access this resource.')
                    break
            }
        }
        return Promise.reject(error)
    }
)

export default api
