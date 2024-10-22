import { Category, Complexity } from '@repo/user-types'

export interface IMatch {
    id: string // match token
    user1Id: string
    user2Id: string
    isCompleted: boolean
    categories: Category[]
    complexity: Complexity
    createdAt: Date
}
