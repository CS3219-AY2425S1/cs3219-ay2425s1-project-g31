import { ChatModel } from './ChatModel'
import { LanguageMode } from './LanguageMode'

export interface ICollabCreateSessionDto {
    matchId: string
    language: LanguageMode
}

export interface ICollabDto extends ICollabCreateSessionDto {
    code: string
    executionResult: string
    chatHistory: ChatModel[]
}
