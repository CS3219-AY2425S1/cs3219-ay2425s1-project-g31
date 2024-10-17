import { Category, Complexity } from '@repo/user-types'
import { IUserQueueMessage } from '../types/IUserQueueMessage'
import { IsEnum, IsNotEmpty, IsString, ValidationError, validate } from 'class-validator'

export class MatchedPair {
    @IsEnum(Complexity)
    @IsNotEmpty()
    complexity: Complexity

    @IsEnum(Category)
    @IsNotEmpty()
    topic: Category

    @IsString()
    @IsNotEmpty()
    user1Id: string

    @IsString()
    @IsNotEmpty()
    user2Id: string

    constructor(user1: IUserQueueMessage, user2: IUserQueueMessage) {
        this.user1Id = user1.userId
        this.user2Id = user2.userId
        this.complexity = user1.complexity
        this.topic = user1.topic
    }
    async validate(): Promise<ValidationError[]> {
        return validate(this)
    }
}
