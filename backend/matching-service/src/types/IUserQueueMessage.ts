import { Category, Complexity } from '@repo/question-types'
import { Proficiency } from '@repo/user-types'

export interface IUserQueueMessage {
    websocketId: string
    proficiency: Proficiency
    complexity: Complexity
    topic: Category
    userId: string
    userName: string
}
