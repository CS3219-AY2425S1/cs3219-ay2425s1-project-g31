import { ITypedBodyRequest } from '@repo/request-types'
import {
    IsArray,
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsString,
    validate,
    ValidateNested,
    ValidationError,
} from 'class-validator'
import { Type } from 'class-transformer'
import { LanguageMode, ChatModel } from '@repo/collaboration-types'
import 'reflect-metadata'

export class CollabDto {
    @IsString()
    @IsNotEmpty()
    matchId: string

    @IsEnum(LanguageMode)
    @IsNotEmpty()
    language: LanguageMode

    @IsString()
    code: string

    @IsString()
    executionResult: string

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ChatModel)
    chatHistory: ChatModel[]

    @IsDate()
    @IsNotEmpty()
    createdAt: Date

    constructor(
        matchId: string,
        language: LanguageMode,
        code: string,
        executionResult: string,
        chatHistory: ChatModel[]
    ) {
        this.matchId = matchId
        this.language = language
        this.code = code
        this.executionResult = executionResult
        this.chatHistory = chatHistory
        this.createdAt = new Date()
    }

    static fromCreateRequest({ body: { matchId, language } }: ITypedBodyRequest<Partial<CollabDto>>): CollabDto {
        return new CollabDto(matchId, language, '', '', [])
    }

    static fromModel({ matchId, language, code, executionResult, chatHistory }: CollabDto): CollabDto {
        return new CollabDto(matchId, language, code, executionResult, chatHistory)
    }

    async validate(): Promise<ValidationError[]> {
        return validate(this)
    }
}
