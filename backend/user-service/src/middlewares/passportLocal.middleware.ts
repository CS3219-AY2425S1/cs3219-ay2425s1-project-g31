import { compare } from 'bcrypt'
import passport from 'passport'
import { IStrategyOptions, IVerifyOptions, Strategy } from 'passport-local'
import { findOneUserByUsernameOrEmail } from '../models/user.repository'
import { UserDto } from '../types/UserDto'

const options: IStrategyOptions = {
    usernameField: 'usernameOrEmail',
    passwordField: 'password',
    session: false,
    passReqToCallback: false,
}

async function handleAuthentication(
    usernameOrEmail: string,
    password: string,
    done: (error: Error | null, user: UserDto | false, options?: IVerifyOptions) => void
): Promise<void> {
    const user = await findOneUserByUsernameOrEmail(usernameOrEmail)
    if (!user) {
        done(null, false)
        return
    }

    const isPasswordMatching = await compare(password, user.password)
    if (!isPasswordMatching) {
        done(null, false)
        return
    }

    const dto = UserDto.fromModel(user)

    done(null, dto)
}

passport.use('local', new Strategy(options, handleAuthentication))
