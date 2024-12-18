import { convertSortedComplexityToComplexity } from '@repo/question-types'
import { IPagination, IQuestion, ISortBy } from '.'
import { SortedComplexity } from '@repo/user-types'

interface ISession {
    isCompleted: string
    complexity: string
    time: number
    category: string
    collaboratorName: string
    question: string
    createdAt: string
}

interface ISessionDto {
    _id: string
    isCompleted: string
    complexity: SortedComplexity
    time: number
    category: string
    user1Id: string
    user1Name: string
    user2Id: string
    user2Name: string
    question: IQuestion
    createdAt: string
}

export interface IGetSessionsDto {
    page: number
    limit: number
    sortBy?: string
    userId: string
}

export interface IGetSessions {
    page: number
    limit: number
    sortBy?: ISortBy
}

export interface ISessionsApi {
    sessions: ISessionDto[]
    pagination: IPagination
}

export interface IPartialSessions {
    collaboratorName: string
    questionTitle: string
    category: string
}

export class SessionManager {
    static fromDto(dto: ISessionDto[], username?: string): ISession[] {
        const getCollaborator = (user1: string, user2: string) => {
            return user1 === username ? user2 : user1
        }

        return dto.map((session) => {
            return {
                isCompleted: session.isCompleted,
                complexity: convertSortedComplexityToComplexity(session.complexity),
                time: session.time,
                category: session.category,
                collaboratorName: getCollaborator(session.user1Name, session.user2Name),
                question: session.question?.title,
                createdAt: session.createdAt,
                _id: session._id,
            }
        })
    }
}

export type { ISession }
