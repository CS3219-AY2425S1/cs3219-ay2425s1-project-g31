import { ITypedBodyRequest } from '@repo/request-types'
import { Category, Proficiency } from '@repo/user-types'
import { IsDateString, IsEnum, IsNotEmpty, IsString, ValidationError, validate } from 'class-validator'

export class UserQueueDto {
    @IsDateString()
    @IsNotEmpty()
    TTL: Date

    @IsNotEmpty()
    websocketId: string

    @IsEnum(Proficiency)
    @IsNotEmpty()
    proficiency: Proficiency

    @IsEnum(Category)
    @IsNotEmpty()
    topic: Category

    @IsString()
    @IsNotEmpty()
    userId: string

    constructor(TTL: Date, websocketId: string, proficiency: Proficiency, topic: Category, userId: string) {
        this.TTL = TTL
        this.websocketId = websocketId
        this.proficiency = proficiency
        this.topic = topic
        this.userId = userId
    }

    static fromRequest({
        body: { TTL, websocketId, proficiency, topic, userId },
    }: ITypedBodyRequest<UserQueueDto>): UserQueueDto {
        return new UserQueueDto(TTL, websocketId, proficiency, topic, userId)
    }

    async validate(): Promise<ValidationError[]> {
        return validate(this)
    }
}
