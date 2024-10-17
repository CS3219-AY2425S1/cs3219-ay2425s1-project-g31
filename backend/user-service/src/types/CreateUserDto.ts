import { ITypedBodyRequest } from '@repo/request-types'
import { Proficiency, Role } from '@repo/user-types'
import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsStrongPassword,
    validate,
    ValidationError,
} from 'class-validator'

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    username: string

    @IsStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
    password: string

    @IsEmail()
    email: string

    @IsEnum(Role)
    role: Role

    @IsOptional()
    @IsEnum(Proficiency)
    proficiency?: Proficiency

    constructor(username: string, email: string, password: string, role: Role, proficiency?: Proficiency) {
        this.username = username
        this.email = email
        this.password = password
        this.role = role
        this.proficiency = proficiency
    }

    static fromRequest({
        body: { username, email, password, role, proficiency },
    }: ITypedBodyRequest<CreateUserDto>): CreateUserDto {
        return new CreateUserDto(username, email, password, role, proficiency)
    }

    async validate(): Promise<ValidationError[]> {
        return validate(this)
    }
}
