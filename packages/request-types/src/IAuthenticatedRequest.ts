import { IUserDto } from '@repo/user-types'
import { Request } from 'express'

export interface IAuthenticatedRequest extends Request {
    user?: IUserDto
}

// We need to redeclare the global namespace to include the IUserDto interface in the Express.User interface.
// Passport declares a global namespace for Express.User, so we need to merge our IUserDto interface with it.
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        interface User extends IUserDto {}
    }
}
