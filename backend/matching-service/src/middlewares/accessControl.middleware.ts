import { IAuthenticatedRequest } from '@repo/request-types'
import { Role } from '@repo/user-types'
import { NextFunction, Response } from 'express'
import logger from '../common/logger.util'

export function handleRoleBasedAccessControl(roles: Role[]) {
    return (request: IAuthenticatedRequest, response: Response, next: NextFunction) => {
        const user = request.user
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

export async function handleOwnershipAccessControl(
    request: IAuthenticatedRequest,
    response: Response,
    next: NextFunction
) {
    const user = request.user
    if (!user) {
        logger.error(
            `[Access Control] [${request.method} ${request.baseUrl + request.path}] User is not authenticated.`
        )
        response.status(500).send()
        return
    }

    if (user.id !== request.params.id) {
        response.status(403).json('INSUFFICIENT_PERMISSIONS').send()
        return
    }

    next()
}
