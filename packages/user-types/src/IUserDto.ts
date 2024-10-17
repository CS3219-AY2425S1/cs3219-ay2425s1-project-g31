import { Proficiency } from './Proficiency'
import { Role } from './Role'

export interface IUserDto {
    id: string
    username: string
    email: string
    role: Role
    proficiency?: Proficiency
}
