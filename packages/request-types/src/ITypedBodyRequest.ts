import type { Request } from 'express'

export interface ITypedBodyRequest<T> extends Request {
    body: T
}
