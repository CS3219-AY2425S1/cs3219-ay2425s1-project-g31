import { IEmailVerificationDto } from '@repo/user-types'
import { IUserDto } from '@repo/user-types'
import axios from 'axios'
import axiosInstance from './axios-middleware'

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
                    throw new Error('Account not found. Please sign up and try again.')
            }
        } else {
            throw new Error('An unexpected error occurred')
        }
    }
}

// POST /auth/reset
export const sendResetPasswordEmail = async (userData: IEmailVerificationDto): Promise<number | undefined> => {
    try {
        const response = await axiosInstance.post<IEmailVerificationDto>('/auth/reset', userData)
        return response.status
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status
            switch (statusCode) {
                case 404:
                    throw new Error('Account not found. Please sign up and try again.')
                case 400:
                    return statusCode
            }
        } else {
            throw new Error('An unexpected error occurred')
        }
    }
}
