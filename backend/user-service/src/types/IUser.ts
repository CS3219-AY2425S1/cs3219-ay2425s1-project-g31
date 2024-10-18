import { Proficiency, Role } from '@repo/user-types'

export interface IUser {
    id: string
    username: string
    email: string
    password: string
    role: Role
    proficiency?: Proficiency
    verificationToken?: string
}
