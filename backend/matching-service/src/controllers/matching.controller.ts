import { ITypedBodyRequest } from '@repo/request-types'
import { Response } from 'express'
import { UserQueueRequest, UserQueueRequestDto } from '../types/UserQueueRequestDto'
import mqConnection from '../services/rabbitmq.service'
import { randomUUID } from 'crypto'
import { WebSocketMessageType } from '@repo/ws-types'
import wsConnection from '../services/ws.service'
import { IMatch } from '@repo/user-types'
import { MatchDto } from '../types/MatchDto'
import { createMatch, getMatchByUserId, isUserInMatch } from '../models/matching.repository'
import { getRandomQuestion } from '../services/matching.service'
import { convertComplexityToSortedComplexity } from '@repo/question-types'

export async function generateWS(request: ITypedBodyRequest<void>, response: Response): Promise<void> {
    const userHasMatch = await isUserInMatch(request.user.id)
    if (userHasMatch) {
        response.status(403).send(userHasMatch)
        return
    }

    if (mqConnection.userCurrentlyConnected(request.user.id)) {
        response.status(409).send('USER_ALREADY_IN_QUEUE')
        return
    }
    mqConnection.addUserConnected(request.user.id)

    const websocketID = randomUUID()
    response.status(200).send({ websocketID: websocketID })
}

export async function addUserToMatchmaking(data: UserQueueRequest): Promise<void> {
    const userHasMatch = await isUserInMatch(data.userId)
    if (userHasMatch) {
        wsConnection.sendMessageToUser(data.websocketId, JSON.stringify({ type: WebSocketMessageType.DUPLICATE }))
        return
    }
    const createDto = UserQueueRequestDto.fromJSON(data)
    const errors = await createDto.validate()
    if (errors.length) {
        return
    }
    await mqConnection.sendToEntryQueue(createDto)
}

export async function removeUserFromMatchingQueue(websocketId: string, userId: string): Promise<void> {
    await mqConnection.cancelUser(websocketId, userId)
    wsConnection.sendMessageToUser(websocketId, JSON.stringify({ type: WebSocketMessageType.CANCEL }))
}

export async function handleCreateMatch(data: IMatch, ws1: string, ws2: string): Promise<IMatch> {
    const isAnyUserInMatch = (await isUserInMatch(data.user1Id)) || (await isUserInMatch(data.user2Id))
    if (isAnyUserInMatch) {
        wsConnection.sendMessageToUser(ws1, JSON.stringify({ type: WebSocketMessageType.DUPLICATE }))
        wsConnection.sendMessageToUser(ws2, JSON.stringify({ type: WebSocketMessageType.DUPLICATE }))
    }

    const question = await getRandomQuestion(data.category, convertComplexityToSortedComplexity(data.complexity))

    if (!question) {
        throw new Error('Question not found')
    }

    const createDto = MatchDto.fromJSON({ ...data, question })
    const errors = await createDto.validate()
    if (errors.length) {
        throw new Error('Invalid match data')
    }
    const dto = await createMatch(createDto)
    wsConnection.sendMessageToUser(ws1, JSON.stringify({ type: WebSocketMessageType.SUCCESS, matchId: dto.id }))
    wsConnection.sendMessageToUser(ws2, JSON.stringify({ type: WebSocketMessageType.SUCCESS, matchId: dto.id }))
    return dto
}

export async function getMatchDetails(request: ITypedBodyRequest<void>, response: Response): Promise<void> {
    const userId = request.user.id
    const match = await getMatchByUserId(userId)

    if (!match) {
        response.status(404).send('MATCH_NOT_FOUND')
        return
    }

    response.status(200).send(match)
}
