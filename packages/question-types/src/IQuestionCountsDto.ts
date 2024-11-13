import { Complexity } from '@repo/user-types'

export interface IQuestionCountsDto {
    data: {
        complexity: Complexity
        count: number
    }[]
}
