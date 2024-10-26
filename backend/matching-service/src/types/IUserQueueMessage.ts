import { Category, Complexity, Proficiency } from '@repo/user-types'

export interface IUserQueueMessage {
    websocketId: string
    proficiency: Proficiency
    complexity: Complexity
    topic: Category
    userId: string
    userName: string
}
