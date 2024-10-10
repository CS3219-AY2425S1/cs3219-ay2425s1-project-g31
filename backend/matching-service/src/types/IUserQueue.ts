import { Category, Proficiency } from '@repo/user-types'

export interface IUserQueue {
    TTL: Date
    websocketId: string
    proficiency: Proficiency
    topic: Category
    userId: string
}
