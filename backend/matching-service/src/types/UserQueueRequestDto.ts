import { ITypedBodyRequest } from '@repo/request-types'
import { Category, Complexity, Proficiency } from '@repo/user-types'
import { IsEnum, IsNotEmpty, IsString, ValidationError, validate } from 'class-validator'

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

    constructor(proficiency: Proficiency, complexity: Complexity, topic: Category, userId: string, timestamp: string) {
        this.proficiency = proficiency
        this.complexity = complexity
        this.topic = topic
        this.userId = userId
        this.timestamp = timestamp
    }

    static fromRequest({
        body: { proficiency, complexity, topic, userId, timestamp },
    }: ITypedBodyRequest<UserQueueRequestDto>): UserQueueRequestDto {
        return new UserQueueRequestDto(proficiency, complexity, topic, userId, timestamp)
    }

    async validate(): Promise<ValidationError[]> {
        return validate(this)
    }
}
