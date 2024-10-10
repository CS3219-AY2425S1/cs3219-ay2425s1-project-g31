import { Category, Proficiency } from '@repo/user-types'

export interface IUserQueueMessage {
    TTL: Date
    websocketId: string
    proficiency: Proficiency
    topic: Category
    userId: string
}
