import { IPagination } from './datatable'
import { Complexity } from '@repo/user-types'

export enum QuestionStatus {
    COMPLETED = 'completed',
    FAILED = 'failed',
    NOT_ATTEMPTED = 'not_attempted',
}

export interface ITestcase {
    input: string
    output: string
}

export interface IQuestion {
    id?: string
    title: string
    description: string
    complexity: Complexity
    categories: string[]
    status?: QuestionStatus
    link?: string
    testCases: ITestcase[]
}

export interface QuestionDto {
    title: string
    description: string
    complexity: Difficulty
    categories: string[]
    link?: string
    testInputs: string[]
    testOutputs: string[]
}

export interface IQuestionsApi {
    pagination: IPagination
    questions: IQuestion[]
}
