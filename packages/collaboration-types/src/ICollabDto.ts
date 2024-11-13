import { ChatModel } from './ChatModel'
import { LanguageMode } from './LanguageMode'
import { ResultModel } from './ResultModel'

export interface ICollabCreateSessionDto {
    matchId: string
    language: LanguageMode
}

export interface ICollabDto extends ICollabCreateSessionDto {
    code: string
    executionResult: ResultModel
    chatHistory: ChatModel[]
}
