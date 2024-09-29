import { Proficiency, Role } from '@repo/user-types'

export interface ICreateUser {
    username: string
    password: string
    email: string
    role: Role
    proficiency: Proficiency
}

export interface ILoginUserRequest {
    usernameOrEmail: string
    password: string
}

export interface ILoginUserResponse {
    id: string
    username: string
    email: string
    role: Role
    proficiency: Proficiency
    accessToken: string
}
