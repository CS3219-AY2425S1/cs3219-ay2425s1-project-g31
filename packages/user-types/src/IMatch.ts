import { Category, Complexity } from '.'
import { IQuestionDto } from '@repo/question-types'

export interface IMatch {
    id: string // match token
    user1Id: string
    user1Name: string
    user2Id: string
    user2Name: string
    question: IQuestionDto
    isCompleted: boolean
    category: Category
    complexity: Complexity
    createdAt: Date
}
