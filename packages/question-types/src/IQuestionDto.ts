import { Category } from './Category'
import { Complexity } from './Complexity'

export interface IQuestionDto {
    id: string
    title: string
    description: string
    categories: Category[]
    complexity: Complexity
    testInputs: string[]
    testOutputs: string[]
    link: string
    createdAt: Date
    updatedAt: Date
}
