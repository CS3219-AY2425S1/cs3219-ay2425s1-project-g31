import { ITypedBodyRequest } from '@repo/request-types'
import { Response } from 'express'
import { getMatch } from '../services/collab.service'

export async function getMatchDetails(
    request: ITypedBodyRequest<{ matchId: string }>,
    response: Response
): Promise<void> {
    const resp = await getMatch(request.body.matchId, request.headers.authorization)
    response.status(resp.status).send(resp.data)
}
