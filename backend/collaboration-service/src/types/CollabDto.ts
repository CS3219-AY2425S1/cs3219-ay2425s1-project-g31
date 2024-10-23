import { IsNotEmpty, IsObject, IsString, ValidationError, validate } from 'class-validator'
import { ICollab } from './ICollab'

export class CollabDto {
    @IsString()
    @IsNotEmpty()
    user1Id: string

    @IsString()
    @IsNotEmpty()
    user1Name: string

    @IsString()
    @IsNotEmpty()
    user2Id: string

    @IsString()
    @IsNotEmpty()
    user2Name: string

    @IsObject()
    code: object

    @IsObject()
    chat: object

    @IsNotEmpty()
    @IsObject()
    question: object

    @IsNotEmpty()
    isCompleted: boolean

    @IsNotEmpty()
    createdAt: Date

    constructor(
        user1Id: string,
        user2Id: string,
        user1Name: string,
        user2Name: string,
        question: object,
        code: object = {},
        chat: object = {}
    ) {
        this.user1Id = user1Id
        this.user2Id = user2Id
        this.user1Name = user1Name
        this.user2Name = user2Name
        this.question = question
        this.code = code
        this.chat = chat
        this.isCompleted = false
        this.createdAt = new Date()
    }

    static fromJSON(data: ICollab): CollabDto {
        return new CollabDto(
            data.user1Id,
            data.user2Id,
            data.user1Name,
            data.user2Name,
            data.question,
            data.code,
            data.chat
        )
    }

    async validate(): Promise<ValidationError[]> {
        return validate(this)
    }
}
