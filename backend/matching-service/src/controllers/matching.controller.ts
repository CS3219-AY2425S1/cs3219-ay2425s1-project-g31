import { ITypedBodyRequest } from '@repo/request-types'
import { Response } from 'express'
import { UserQueueRequest, UserQueueRequestDto } from '../types/UserQueueRequestDto'
import mqConnection from '../services/rabbitmq.service'
import { randomUUID } from 'crypto'
import { WebSocketMessageType } from '@repo/ws-types'
import wsConnection from '../services/ws.service'
import { IMatch } from '../types/IMatch'
import { MatchDto } from '../types/MatchDto'
import { createMatch, getMatchById, isUserInMatch } from '../models/matching.repository'

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
    const createDto = MatchDto.fromJSON(data)
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
    const match = await getMatchById(request.params.matchId)

    if (!match) {
        response.status(404).send('MATCH_NOT_FOUND')
        return
    }

    const userId = request.user.id

    if (match.user1Id !== userId && match.user2Id !== userId) {
        response.status(403).send('UNAUTHORIZED')
        return
    }

    response.status(200).send(match)
}
