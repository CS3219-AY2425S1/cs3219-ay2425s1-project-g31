import { ITypedBodyRequest } from '@repo/request-types'
import { Category, Proficiency } from '@repo/user-types'
import { IsDateString, IsEnum, IsNotEmpty, IsString, IsUrl, ValidationError, validate } from 'class-validator'

export class UserQueueDto {
    @IsDateString()
    @IsNotEmpty()
    TTL: Date

    @IsUrl()
    @IsNotEmpty()
    websocketUrl: string

    @IsEnum(Proficiency)
    @IsNotEmpty()
    proficiency: Proficiency

    @IsEnum(Category)
    @IsNotEmpty()
    topic: Category

    @IsString()
    @IsNotEmpty()
    userId: string

    constructor(TTL: Date, websocketUrl: string, proficiency: Proficiency, topic: Category, userId: string) {
        this.TTL = TTL
        this.websocketUrl = websocketUrl
        this.proficiency = proficiency
        this.topic = topic
        this.userId = userId
    }

    static fromRequest({
        body: { TTL, websocketUrl, proficiency, topic, userId },
    }: ITypedBodyRequest<UserQueueDto>): UserQueueDto {
        return new UserQueueDto(TTL, websocketUrl, proficiency, topic, userId)
    }

    async validate(): Promise<ValidationError[]> {
        return validate(this)
    }
}
