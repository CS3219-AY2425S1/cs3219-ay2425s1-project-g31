import { ITypedBodyRequest } from '@repo/request-types'
import { IUserDto, Proficiency, Role } from '@repo/user-types'
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, validate, ValidationError } from 'class-validator'
import { IUser } from './IUser'

export class UserDto implements IUserDto {
    @IsString()
    @IsNotEmpty()
    id: string

    @IsString()
    @IsNotEmpty()
    username: string

    @IsEmail()
    email: string

    @IsEnum(Role)
    role: Role

    @IsOptional()
    @IsEnum(Proficiency)
    proficiency?: Proficiency

    constructor(id: string, username: string, email: string, role: Role, proficiency?: Proficiency) {
        this.id = id
        this.username = username
        this.email = email
        this.role = role
        this.proficiency = proficiency
    }

    static fromModel({ id, username, email, role, proficiency }: IUser): UserDto {
        return new UserDto(id, username, email, role, proficiency)
    }

    static fromRequest({ body: { id, username, email, role, proficiency } }: ITypedBodyRequest<UserDto>): UserDto {
        return new UserDto(id, username, email, role, proficiency)
    }

    async validate(): Promise<ValidationError[]> {
        return validate(this)
    }
}
