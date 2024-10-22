import { ITypedBodyRequest } from '@repo/request-types'
import { Response } from 'express'
import { getMatch, getRandomQuestion } from '../services/collab.service'

export async function getMatchDetails(
    request: ITypedBodyRequest<{ matchId: string }>,
    response: Response
): Promise<void> {
    const matchResponse = await getMatch(request.body.matchId, request.headers.authorization)

    if (matchResponse.status !== 200) {
        response.status(matchResponse.status).send(matchResponse.data)
        return
    }

    if (!matchResponse.data) {
        response.status(404).send('MATCH_NOT_FOUND')
        return
    }

    const questionResponse = await getRandomQuestion(
        matchResponse.data.category,
        matchResponse.data.complexity,
        request.headers.authorization
    )

    if (!questionResponse) {
        response.status(404).send('QUESTION_NOT_FOUND')
        return
    }

    response.status(200).send({ question: questionResponse, match: matchResponse.data })
}
