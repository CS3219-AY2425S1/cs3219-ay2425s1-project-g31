import { Proficiency } from '@repo/user-types'

export interface IValidateFormInput {
    username: string
    email: string
    password: string
    confirmPassword: string
    proficiency: Proficiency
    loginPassword: string
    otp: string
}

export interface IErrorFormInput extends Omit<IValidateFormInput, 'proficiency'> {
    proficiency: string
}

export interface IValidateFormInputBoolean {
    username: boolean
    email: boolean
    password: boolean
    confirmPassword: boolean
    proficiency: boolean
    loginPassword: boolean
    otp: boolean
}
