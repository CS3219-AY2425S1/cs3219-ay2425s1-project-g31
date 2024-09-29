import { IPagination } from './datatable'
import { Difficulty } from './difficulty'

export enum QuestionStatus {
    COMPLETED = 'completed',
    FAILED = 'failed',
    NOT_ATTEMPTED = 'not_attempted',
}
export interface IQuestion {
    id?: string
    title: string
    description: string
    complexity: Difficulty
    categories: string[]
    status?: QuestionStatus
    link?: string
}

export interface IQuestionsApi {
    pagination: IPagination
    questions: IQuestion[]
}
