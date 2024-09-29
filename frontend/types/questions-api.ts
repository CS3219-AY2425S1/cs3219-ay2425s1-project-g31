import { ISortBy } from './datatable'

export interface IGetQuestions {
    page: number
    limit: number
    sortBy?: ISortBy
}

export interface IGetQuestionsDto {
    page: number
    limit: number
    sortBy?: string
}
