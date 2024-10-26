import { Category, Complexity } from '@repo/user-types'

export interface IMatch {
    id: string // match token
    user1Id: string
    user2Id: string
    questionId: string
    isCompleted: boolean
    category: Category
    complexity: Complexity
    createdAt: Date
}
