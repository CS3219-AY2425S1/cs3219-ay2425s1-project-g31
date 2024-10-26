import { Category, Complexity } from '@repo/user-types'
import { IsEnum, IsNotEmpty, IsString, ValidationError, validate } from 'class-validator'
import { IMatch } from './IMatch'

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
    user2Id: string

    @IsNotEmpty()
    isCompleted: boolean

    @IsNotEmpty()
    createdAt: Date

    constructor(
        user1Id: string,
        user2Id: string,
        complexity: Complexity,
        category: Category,
        isCompleted: boolean = false,
        createdAt: Date = new Date()
    ) {
        this.user1Id = user1Id
        this.user2Id = user2Id
        this.complexity = complexity
        this.category = category
        this.isCompleted = isCompleted
        this.createdAt = createdAt
    }

    static fromJSON(data: IMatch): MatchDto {
        return new MatchDto(
            data.user1Id,
            data.user2Id,
            data.complexity,
            data.category,
            data.isCompleted,
            data.createdAt
        )
    }

    async validate(): Promise<ValidationError[]> {
        return validate(this)
    }
}
