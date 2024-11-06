import { Complexity } from './Complexity'

export interface IQuestionCountsDto {
    data: {
        complexity: Complexity
        count: number
    }[]
}
