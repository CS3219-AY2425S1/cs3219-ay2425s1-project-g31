import { compare, hash } from 'bcrypt'

export async function comparePasswords(plaintextPassword: string, hashedPassword: string): Promise<boolean> {
    return compare(plaintextPassword, hashedPassword)
}

export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10
    return hash(password, saltRounds)
}
