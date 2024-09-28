export interface ISignUp {
    username: string
    password: string
    email: string
    role: 'USER' | 'ADMIN'
    proficiency: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
}
