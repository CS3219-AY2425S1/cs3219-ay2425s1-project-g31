import { IAccessTokenPayload, IUserDto } from '@repo/user-types'
import { Request } from 'express'
import passport, { DoneCallback } from 'passport'
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt'
import config from '../common/config.util'
import { getUserById } from '../services/user.service'

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    algorithms: ['RS256'],
    secretOrKey: Buffer.from(config.ACCESS_TOKEN_PUBLIC_KEY, 'base64'),
    issuer: 'user-service',
    audience: 'frontend',
    passReqToCallback: true,
}

async function handleAuthorisation(request: Request, payload: IAccessTokenPayload, done: DoneCallback): Promise<void> {
    const id = payload.id
    const accessToken = request.headers.authorization

    // Should replace this with a gRPC call in the future
    let user: IUserDto
    try {
        user = await getUserById(id, accessToken)
    } catch {
        return done(null, false)
    }

    if (!user) {
        return done(null, false)
    }

    return done(null, user)
}

passport.use('jwt', new Strategy(options, handleAuthorisation))
