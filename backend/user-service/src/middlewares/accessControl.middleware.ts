import { NextFunction, Request, Response } from 'express'
import logger from '../common/logger.util'
import { Role } from '../types/Role'
import { UserDto } from '../types/UserDto'

export default (roles: Role[]) => {
    return (request: Request, response: Response, next: NextFunction) => {
        const user: UserDto | undefined = request.user as UserDto
        if (!user) {
            logger.error(
                `[Access Control] [${request.method} ${request.baseUrl + request.path}] User is not authenticated.`
            )
            response.status(500).send()
            return
        }

        if (!roles.includes(user.role)) {
            response.status(403).json('INSUFFICIENT_PERMISSIONS').send()
            return
        }

        next()
    }
}
