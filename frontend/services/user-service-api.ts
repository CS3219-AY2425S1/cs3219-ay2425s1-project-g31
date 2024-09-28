import axiosInstance from './axios-middleware'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { CreateUserDto } from '../../backend/user-service/src/types/CreateUserDto'
import { UserDto } from '../../backend/user-service/src/types/UserDto'
import { ISignUp } from '@/types/api'

// Define the shape of credentials for signing up
interface SignUpCredentials {
    email: string
    password: string
    // Add more fields as necessary, like username, etc.
}

// Define the expected shape of the API response
interface SignUpResponse {
    id: string
    username: string
    email: string
    role: string
    proficiency: string
}

interface ErrorResponse {
    message: string
    // Other fields as per your API error response structure
}

// Example API call to fetch user data
export const fetchUserData = async () => {
    try {
        const data = await axiosInstance.get('/user')
        return data
    } catch (error) {
        console.error('Failed to fetch user data:', error)
        throw error
    }
}

// Example API call to login
export const signUpRequest = async (userData: ISignUp): Promise<UserDto> => {
    try {
        // Send a POST request to the /users endpoint
        const response = await axios.post<UserDto>('/users', userData)
        return response.data // Return the created user data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Handle Axios errors
            const errorMessages = error.response?.data || ['An unknown error occurred']
            console.error('Error creating user:', errorMessages)
            throw new Error(errorMessages.join(', '))
        } else {
            // Handle non-Axios errors
            console.error('An unexpected error occurred:', error)
            throw new Error('An unexpected error occurred')
        }
    }
}

// const getUsers = async (): Promise<ApiResponse | ApiError> => {
//     try {
//         const { data } = await axios.get<ApiResponse>('https://my-api.com/users')
//         return data
//     } catch (error) {
//         return {
//             message: error.message,
//             status: error.response.status
//         }
//     }
// }

// const getToken = async () => {
//     try {
//         const configurationObject = {
//             method: 'post',
//             headers: {
//                 Accept: 'application/json',
//                 'Content-Type': 'application/x-www-form-urlencoded',
//             },
//             data: {
//                 client_id: 'pkTJkZpIx4buxqThtt9uCtt0ZA4HRXqa4mhzhXkg',
//                 client_secret: 'PFEAJ5cHwWwjKxEyApBvCXbp4BOgGCzqPoDDHWaS2lif2l3JPoh6wB7YvCtHSIFN2FXz0bxOdK1RxVVV4W0pj1O9O7nHK7uwPibPoyEK99WXt0B9Q6tJ0D0kaHex2ysT',
//                 grant_type: 'client_credentials',
//             }
//         };

//         const response:AxiosResponse<> = await axiosInstance(configurationObject)
//         token = response.data.access_token
//         console.log("Token: " + token)
//     } catch (error) {
//         console.log(error)
//         console.log('Failed to get token')
//     }
// }
