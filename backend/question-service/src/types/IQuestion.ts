import { Category } from './Category'
import { Complexity } from './Complexity'

export interface IQuestion {
    id: string
    title: string
    description: string
    categories: Category[]
    complexity: Complexity
    link: string
    testInputs: string[]
    testOutputs: string[]
    createdAt: Date
    updatedAt: Date
}
