import { ChatModel } from './ChatModel'

export interface ICollabDto {
    matchId: string
    language: string
    code: string
    executionResult: string
    chatHistory: ChatModel[]
}
