import { ITypedBodyRequest } from '@repo/request-types'
import { IsDate, IsEmail, IsNotEmpty, IsNumberString, ValidationError, validate } from 'class-validator'

export class EmailVerificationDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsNumberString()
    verificationToken?: string

    @IsDate()
    updatedAt: Date

    constructor(email: string, verificationToken?: string) {
        this.email = email
        this.verificationToken = verificationToken
        this.updatedAt = new Date()
    }

    static fromRequest({
        body: { email, verificationToken },
    }: ITypedBodyRequest<EmailVerificationDto>): EmailVerificationDto {
        return new EmailVerificationDto(email, verificationToken)
    }

    async validate(): Promise<ValidationError[]> {
        return validate(this)
    }
}
