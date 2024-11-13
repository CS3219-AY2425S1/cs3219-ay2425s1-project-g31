import { IAccessTokenPayload } from '@repo/user-types'
import passport, { DoneCallback } from 'passport'
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt'
import config from '../common/config.util'
import { findOneUserById } from '../models/user.repository'
import { UserDto } from '../types/UserDto'

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    algorithms: ['RS256'],
    secretOrKey: Buffer.from(config.ACCESS_TOKEN_PUBLIC_KEY, 'base64'),
    issuer: 'user-service',
    audience: 'frontend',
}

async function handleAuthorisation(payload: IAccessTokenPayload, done: DoneCallback): Promise<void> {
    const user = await findOneUserById(payload.id)
    if (!user) {
        return done(null, false)
    }

    const dto = UserDto.fromModel(user)
    return done(null, dto)
}

passport.use('jwt', new Strategy(options, handleAuthorisation))
