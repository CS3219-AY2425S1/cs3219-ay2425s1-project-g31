import { Category, Complexity, Proficiency } from '@repo/user-types'

export interface IPostMatching {
    userId: string
    proficiency: Proficiency
    complexity: Complexity
    topic: Category
    timestamp: string
}
