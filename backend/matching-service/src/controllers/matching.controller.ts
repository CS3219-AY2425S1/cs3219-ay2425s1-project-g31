import { ITypedBodyRequest } from '@repo/request-types'
import { Response } from 'express'

import { ValidationError } from 'class-validator'
import { UserQueueRequestDto } from '../types/UserQueueRequestDto'
import mqConnection from '../services/rabbitmq.service'
import { IUserQueueMessage } from '../types/IUserQueueMessage'

export async function addUserToMatchingQueue(
    request: ITypedBodyRequest<UserQueueRequestDto>,
    response: Response
): Promise<void> {
    const createDto = UserQueueRequestDto.fromRequest(request)
    const errors = await createDto.validate()
    if (errors.length) {
        const errorMessages = errors.map((error: ValidationError) => `INVALID_${error.property.toUpperCase()}`)
        response.status(400).json(errorMessages).send()
        return
    }

    // Add logic to generate and return 2 WS IDs

    const message: IUserQueueMessage = { ...createDto, websocketId: 'testing' }
    await mqConnection.sendToEntryQueue(message)
    response.status(200).send()
}
