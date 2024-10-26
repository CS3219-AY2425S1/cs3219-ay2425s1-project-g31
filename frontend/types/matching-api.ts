import { Category, Complexity, Proficiency } from '@repo/user-types'

export interface IPostMatching {
    userId: string
    userName: string
    proficiency: Proficiency
    complexity: Complexity
    topic: Category
    websocketId: string
}

export enum MatchingStatus {
    NOT_IN_QUEUE = 'NOT_IN_QUEUE',
    USER_ALREADY_IN_QUEUE = 'USER_ALREADY_IN_QUEUE',
    MATCH_FOUND = 'MATCH_FOUND',
    QUEUED = 'QUEUED',
    MATCH_EXISTS = 'MATCH_EXISTS',
    MATCH_NOT_FOUND = 'MATCH_NOT_FOUND',
}
