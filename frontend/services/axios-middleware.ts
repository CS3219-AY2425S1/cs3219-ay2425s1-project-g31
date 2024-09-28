import axios from 'axios'

// Create an instance of Axios
const api = axios.create({
    baseURL: 'http://localhost:3002',
})

// Rrequest interceptor for all axios calls
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken')
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor for all axios calls
api.interceptors.response.use(
    (response) => {
        return response.data
    },
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    console.error('Unauthorized! Please log in again.')
                    break
                default:
                    console.error('An error occurred:', error.response.data)
            }
        }
        return Promise.reject(error)
    }
)

export default api
