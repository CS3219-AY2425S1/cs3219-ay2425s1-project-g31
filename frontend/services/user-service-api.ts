import axiosInstance from './axios-middleware'
import axios from 'axios'
import { IUserDto } from '@repo/user-types'

// POST /users
export const signUpRequest = async (userData: IUserDto): Promise<IUserDto | undefined> => {
    try {
        const response = await axiosInstance.post<IUserDto>('/users', userData)
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status
            const errorResponse = error.response?.data

            switch (statusCode) {
                case 409:
                    console.log(errorResponse)
                    if (errorResponse === 'DUPLICATE_USERNAME') {
                        throw new Error('This username is already in use!')
                    } else if (errorResponse === 'DUPLICATE_EMAIL') {
                        throw new Error('This email is already in use!')
                    }
                    break

                case 500:
                    throw new Error('Failed to connect to the server!')

                default:
                    console.error('Error creating user:', errorResponse)
                    throw new Error('Unknown error when creating user')
            }
        } else {
            throw new Error('An unexpected error occurred')
        }
    }
}

// Incomplete
export const loginRequest = async (userData: IUserDto): Promise<IUserDto | undefined> => {
    try {
        const response = await axiosInstance.post<IUserDto>('/login', userData)
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status

            switch (statusCode) {
                case 404:
                    throw new Error('No such user, please try again!')
            }
        } else {
            throw new Error('An unexpected error occurred')
        }
    }
}