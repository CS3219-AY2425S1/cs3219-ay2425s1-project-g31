import { IAccessTokenPayload, IUserDto, Role } from '@repo/user-types'
import { SignOptions, sign } from 'jsonwebtoken'
import config from '../common/config.util'

export async function generateAccessToken(user: IUserDto): Promise<string> {
    const payload: Partial<IAccessTokenPayload> = {
        id: user.id,
        admin: user.role === Role.ADMIN,
    }
    const options: SignOptions = {
        subject: user.email,
        algorithm: 'RS256', // Assymetric Algorithm
        expiresIn: '1h',
        issuer: 'user-service',
        audience: 'frontend',
    }

    const privateKey: Buffer = Buffer.from(config.ACCESS_TOKEN_PRIVATE_KEY, 'base64')

    return sign(payload, privateKey, options)
}
