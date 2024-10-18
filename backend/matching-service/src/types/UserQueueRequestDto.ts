import { Category, Complexity, Proficiency } from '@repo/user-types'
import { IsEnum, IsNotEmpty, IsString, ValidationError, validate } from 'class-validator'

export type UserQueueRequest = {
    proficiency: Proficiency
    complexity: Complexity
    topic: Category
    userId: string
    timestamp: string
    websocketId: string
}

export class UserQueueRequestDto {
    @IsEnum(Proficiency)
    @IsNotEmpty()
    proficiency: Proficiency

    @IsEnum(Complexity)
    @IsNotEmpty()
    complexity: Complexity

    @IsEnum(Category)
    @IsNotEmpty()
    topic: Category

    @IsString()
    @IsNotEmpty()
    userId: string

    @IsString()
    @IsNotEmpty()
    timestamp: string

    @IsString()
    @IsNotEmpty()
    websocketId: string

    constructor(
        proficiency: Proficiency,
        complexity: Complexity,
        topic: Category,
        userId: string,
        timestamp: string,
        websocketId: string
    ) {
        this.proficiency = proficiency
        this.complexity = complexity
        this.topic = topic
        this.userId = userId
        this.timestamp = timestamp
        this.websocketId = websocketId
    }

    static fromJSON(data: UserQueueRequest): UserQueueRequestDto {
        return new UserQueueRequestDto(
            data.proficiency,
            data.complexity,
            data.topic,
            data.userId,
            data.timestamp,
            data.websocketId
        )
    }

    async validate(): Promise<ValidationError[]> {
        return validate(this)
    }
}
