import { Category, Complexity } from '@repo/user-types'

export interface IMatch {
    id: string // match token
    user1Id: string
    user1Name: string
    user2Id: string
    user2Name: string
    question: object
    isCompleted: boolean
    category: Category
    complexity: Complexity
    createdAt: Date
}
