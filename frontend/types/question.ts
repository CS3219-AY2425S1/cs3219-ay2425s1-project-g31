import { Complexity } from '@repo/question-types'
import { IPagination } from './datatable'

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
    complexity: Complexity
    categories: string[]
    link?: string
    testInputs: string[]
    testOutputs: string[]
}

export interface IQuestionsApi {
    pagination: IPagination
    questions: IQuestion[]
}
