import { ITypedBodyRequest } from '@repo/request-types'
import { Category, Proficiency } from '@repo/user-types'
import { IsEnum, IsNotEmpty, IsString, ValidationError, validate } from 'class-validator'

export class UserQueueRequestDto {
    @IsEnum(Proficiency)
    @IsNotEmpty()
    proficiency: Proficiency

    @IsEnum(Category)
    @IsNotEmpty()
    topic: Category

    @IsString()
    @IsNotEmpty()
    userId: string

    constructor(proficiency: Proficiency, topic: Category, userId: string) {
        this.proficiency = proficiency
        this.topic = topic
        this.userId = userId
    }

    static fromRequest({
        body: { proficiency, topic, userId },
    }: ITypedBodyRequest<UserQueueRequestDto>): UserQueueRequestDto {
        return new UserQueueRequestDto(proficiency, topic, userId)
    }

    async validate(): Promise<ValidationError[]> {
        return validate(this)
    }
}
