import { Complexity } from '@repo/user-types'
import { IPagination } from './datatable'

export enum QuestionStatus {
    COMPLETED = 'completed',
    FAILED = 'failed',
    NOT_ATTEMPTED = 'not_attempted',
}
export interface IQuestion {
    id?: string
    title: string
    description: string
    complexity: Complexity
    categories: string[]
    status?: QuestionStatus
    link?: string
}

export interface IQuestionsApi {
    pagination: IPagination
    questions: IQuestion[]
}
