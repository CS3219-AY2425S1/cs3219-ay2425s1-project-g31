import { Proficiency, Role } from '@repo/user-types'

export interface ICreateUser {
    username: string
    password: string
    email: string
    role: Role
    proficiency: Proficiency
}

export interface ILoginUserRequest extends IUserPassword {
    usernameOrEmail: string
}

export interface IUserPassword {
    password: string
}

export interface IUserInfo {
    id: string
    username: string
    email: string
    role: Role
    proficiency: Proficiency
}

export interface ILoginUserResponse extends IUserInfo {
    accessToken: string
}

export interface IUserProfile {
    username: string
    proficiency: Proficiency
}
