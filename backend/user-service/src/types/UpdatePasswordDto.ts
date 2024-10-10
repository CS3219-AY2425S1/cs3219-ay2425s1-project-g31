import {
    IsDate,
    IsEmail,
    IsNotEmpty,
    IsNumberString,
    IsString,
    IsStrongPassword,
    ValidationError,
    validate,
} from 'class-validator'

import { ITypedBodyRequest } from '@repo/request-types'

export class UpdatePasswordDto {
    @IsEmail()
    email: string

    @IsString()
    @IsStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
    @IsNotEmpty()
    password: string

    @IsNumberString()
    verificationToken?: string

    @IsDate()
    updatedAt: Date

    constructor(email: string, password: string, verificationToken?: string) {
        this.email = email
        this.password = password
        this.verificationToken = verificationToken
        this.updatedAt = new Date()
    }

    static fromRequest({
        body: { email, password, verificationToken },
    }: ITypedBodyRequest<UpdatePasswordDto>): UpdatePasswordDto {
        return new UpdatePasswordDto(email, password, verificationToken)
    }

    async validate(): Promise<ValidationError[]> {
        return validate(this)
    }
}
