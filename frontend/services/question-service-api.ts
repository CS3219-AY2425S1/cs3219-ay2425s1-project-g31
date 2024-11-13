import { IGetQuestions, IGetQuestionsDto, IQuestion, IQuestionsApi, SortDirection } from '@/types'
import { QuestionDto } from '@/types/question'
import { IQuestionCountsDto } from '@repo/question-types'
import { Complexity } from '@repo/user-types'
import axios from 'axios'
import axiosClient from './axios-middleware'

const axiosInstance = axiosClient.questionServiceAPI

// GET /questions
export const getQuestionsRequest = async (data: IGetQuestions): Promise<IQuestionsApi | undefined> => {
    try {
        let params: IGetQuestionsDto = {
            page: data.page == 0 ? 1 : data.page,
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
            throw new Error('An unexpected error occurred: ' + error.message)
        } else {
            throw new Error('An unexpected error occurred')
        }
    }
}

// GET /question/:id
export const getQuestionbyIDRequest = async (id: string): Promise<IQuestion | undefined> => {
    try {
        const response: QuestionDto = await axiosInstance.get(`/questions/${id}`)
        const data = {
            ...response,
            testCases: response.testInputs.map((input, index) => {
                return {
                    input: input,
                    output: response.testOutputs[index],
                }
            }),
        }
        return data as IQuestion
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status

            switch (statusCode) {
                case 404:
                    throw new Error('Error getting questions: No such user!')
                default:
                    throw new Error('An error occurred: ' + error.message)
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
            testInputs: data.testCases?.map((testCase) => testCase.input),
            testOutputs: data.testCases?.map((testCase) => testCase.output),
        }
        const response: IQuestion = await axiosInstance.post(`/questions`, postData)
        return response
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status

            switch (statusCode) {
                case 404:
                    throw new Error('Error creating the question: No such user!')
                case 401:
                    throw new Error('Error creating the question: Unauthorized')
                case 400:
                    throw new Error(
                        'Error creating the question: Invalid input: ' +
                            error.response?.data.map((err: string) => `(${err})`).join(', ')
                    )
                default:
                    throw new Error('An unexpected error occurred: ' + error.message)
            }
        } else {
            throw new Error('An unexpected error occurred')
        }
    }
}

// PUT /question/:id
export const updateQuestionRequest = async (data: IQuestion): Promise<IQuestion | undefined> => {
    try {
        const body: QuestionDto = {
            ...data,
            complexity: data.complexity.toUpperCase() as Complexity,
            testInputs: data.testCases?.map((testCase) => testCase.input),
            testOutputs: data.testCases?.map((testCase) => testCase.output),
        }
        const response: IQuestion = await axiosInstance.put(`/questions/${data.id}`, body)
        return response
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status

            switch (statusCode) {
                case 401:
                    throw new Error('Error updating the question: Unauthorized')
                case 404:
                    throw new Error('Error updating the question: No such user!')
                case 400:
                    throw new Error(
                        'Error creating the question: Invalid input: ' +
                            error.response?.data.map((err: string) => `(${err})`).join(', ')
                    )
                default:
                    throw new Error('An unexpected error occurred: ' + error.message)
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
                case 401:
                    throw new Error('Error deleting the question: Unauthorized')
                case 404:
                    throw new Error('Error deleting the question: No such user!')
                default:
                    throw new Error('An unexpected error occurred: ' + error.message)
            }
        } else {
            throw new Error('An unexpected error occurred')
        }
    }
}

// GET /questions/complexity/count
export const getQuestionCountsRequest = async (): Promise<IQuestionCountsDto | undefined> => {
    try {
        const response: IQuestionCountsDto = await axiosInstance.get(`/questions/complexity/count`)
        return response
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error('An unexpected error occurred: ' + error.message)
        } else {
            throw new Error('An unexpected error occurred')
        }
    }
}
