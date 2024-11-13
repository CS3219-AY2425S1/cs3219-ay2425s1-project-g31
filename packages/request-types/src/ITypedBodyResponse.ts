import type { Response } from 'express'

export interface ITypedBodyResponse<T> extends Response {
    body: T
}
