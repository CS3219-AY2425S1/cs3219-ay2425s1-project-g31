import { Category, Complexity, IMatch } from '@repo/user-types'
import { IsEnum, IsNotEmpty, IsObject, IsString, ValidationError, validate } from 'class-validator'

export class MatchDto {
    @IsEnum(Complexity)
    @IsNotEmpty()
    complexity: Complexity

    @IsEnum(Category)
    @IsNotEmpty()
    category: Category

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
    @IsNotEmpty()
    question: object

    @IsNotEmpty()
    isCompleted: boolean

    @IsNotEmpty()
    createdAt: Date

    constructor(
        user1Id: string,
        user1Name: string,
        user2Id: string,
        user2Name: string,
        complexity: Complexity,
        category: Category,
        question: object,
        isCompleted: boolean = false,
        createdAt: Date = new Date()
    ) {
        this.user1Id = user1Id
        this.user1Name = user1Name
        this.user2Id = user2Id
        this.user2Name = user2Name
        this.complexity = complexity
        this.category = category
        this.question = question
        this.isCompleted = isCompleted
        this.createdAt = createdAt
    }

    static fromJSON(data: IMatch): MatchDto {
        return new MatchDto(
            data.user1Id,
            data.user1Name,
            data.user2Id,
            data.user2Name,
            data.complexity,
            data.category,
            data.question,
            data.isCompleted,
            data.createdAt
        )
    }

    async validate(): Promise<ValidationError[]> {
        return validate(this)
    }
}
