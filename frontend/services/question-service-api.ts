import { IGetQuestions, IGetQuestionsDto, IQuestion, IQuestionsApi, SortDirection } from '@/types'
import axios from 'axios'
import axiosInstance from './axios-middleware2'

// GET /questions
export const getQuestionsRequest = async (data: IGetQuestions): Promise<IQuestionsApi | undefined> => {
    try {
        let params: IGetQuestionsDto = {
            page: data.page,
            limit: data.limit,
        }
        if (data.sortBy && data.sortBy.direction !== SortDirection.NONE) {
            params = { ...params, sortBy: `${data.sortBy.sortKey}:${data.sortBy.direction}` }
        }
        const response: IQuestionsApi = await axiosInstance.get(`/questions/`, {
            params: params,
        })
        return response
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error('An unexpected error occurred' + error.message)
        } else {
            throw new Error('An unexpected error occurred')
        }
    }
}

// GET /question/:id
export const getQuestionbyIDRequest = async (id: string): Promise<IQuestion | undefined> => {
    try {
        const response: IQuestion = await axiosInstance.get(`/questions/${id}`)
        return response
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status

            switch (statusCode) {
                case 404:
                    throw new Error('Error getting questions: No such user!')
                default:
                    throw new Error('An unexpected error occurred' + error.message)
            }
        } else {
            throw new Error('An unexpected error occurred')
        }
    }
}

// POST /questions
export const createQuestionRequest = async (data: IQuestion): Promise<IQuestion | undefined> => {
    try {
        const postData = {
            title: data.title,
            description: data.description,
            complexity: data.complexity.toUpperCase(),
            categories: data.categories.map((category) => category.toUpperCase()),
            link: data.link,
        }
        console.log('Requesting to create question: ', postData)
        const response: IQuestion = await axiosInstance.post(`/questions`, postData)
        return response
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status

            switch (statusCode) {
                case 404:
                    throw new Error('Error getting questions: No such user!')
                case 400:
                    throw new Error('Error creating question: Bad request' + error.message)
                default:
                    throw new Error('An unexpected error occurred' + error.message)
            }
        } else {
            throw new Error('An unexpected error occurred')
        }
    }
}

// PUT /question/:id
export const updateQuestionRequest = async (data: IQuestion): Promise<IQuestion | undefined> => {
    try {
        const body = {
            ...data,
            complexity: data.complexity.toUpperCase(),
        }
        const response: IQuestion = await axiosInstance.put(`/questions/${data.id}`, body)
        return response
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status

            switch (statusCode) {
                case 404:
                    throw new Error('Error getting questions: No such user!')
                default:
                    throw new Error('An unexpected error occurred' + error.message)
            }
        } else {
            throw new Error('An unexpected error occurred')
        }
    }
}

// DELETE /question/:id
export const deleteQuestionById = async (id: string): Promise<IQuestion | undefined> => {
    try {
        const response: IQuestion = await axiosInstance.delete(`/questions/${id}`)
        return response
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status

            switch (statusCode) {
                case 404:
                    throw new Error('Error getting questions: No such user!')
                default:
                    throw new Error('An unexpected error occurred' + error.message)
            }
        } else {
            throw new Error('An unexpected error occurred')
        }
    }
}
