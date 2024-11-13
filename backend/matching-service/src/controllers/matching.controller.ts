import { ICollabDto, LanguageMode } from '@repo/collaboration-types'
import { convertComplexityToSortedComplexity } from '@repo/question-types'
import { IPaginationRequest, ITypedBodyRequest } from '@repo/request-types'
import { IMatch } from '@repo/user-types'
import { WebSocketMessageType } from '@repo/ws-types'
import axios from 'axios'
import { randomUUID } from 'crypto'
import { Request, Response } from 'express'
import config from '../common/config.util'
import logger from '../common/logger.util'
import {
    createMatch,
    findCompletedQuestionCount,
    findMatchCount,
    findOngoingMatch,
    findPaginatedMatches,
    findPaginatedMatchesWithSort,
    getMatchByUserIdandMatchId,
    isUserInMatch,
    isValidSort,
    updateMatchCompletion,
} from '../models/matching.repository'
import { wsConnection } from '../server'
import { getRandomQuestion } from '../services/matching.service'
import mqConnection from '../services/rabbitmq.service'
import { MatchDto } from '../types/MatchDto'
import { UserQueueRequest, UserQueueRequestDto } from '../types/UserQueueRequestDto'

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

export async function handleCreateMatch(data: IMatch, ws1: string, ws2: string): Promise<IMatch | undefined> {
    const isAnyUserInMatch = (await isUserInMatch(data.user1Id)) || (await isUserInMatch(data.user2Id))

    if (isAnyUserInMatch) {
        wsConnection.sendMessageToUser(ws1, JSON.stringify({ type: WebSocketMessageType.DUPLICATE }))
        wsConnection.sendMessageToUser(ws2, JSON.stringify({ type: WebSocketMessageType.DUPLICATE }))
    }

    let question

    try {
        question = await getRandomQuestion(data.category, convertComplexityToSortedComplexity(data.complexity))
    } catch (err) {
        logger.error('[Matching-Service] Failed to get random question' + err)
        return
    }

    if (!question) {
        logger.error('[Matching-Service] Could not get a random question')
        return
    }

    const createDto = MatchDto.fromJSON({ ...data, question })
    const errors = await createDto.validate()

    if (errors.length) {
        logger.error('[Matching-Service] Invalid match data')
        return
    }

    const dto = await createMatch(createDto)

    if (!dto) {
        logger.error('[Matching-Service] Failed to create match')
        return
    }

    return dto
}

export async function handleCreateSession(matchDto: IMatch, ws1: string, ws2: string): Promise<ICollabDto> {
    const session = await axios.post(`${config.COLLABORATION_SERVICE_URL}/collab`, {
        matchId: matchDto.id,
        language: LanguageMode.Javascript,
    })

    if (!session) {
        logger.error('[Matching Service] Failed to create session on collaboration service')
        return
    }

    const message = JSON.stringify({ type: WebSocketMessageType.SUCCESS, matchId: matchDto.id })
    wsConnection.sendMessageToUser(ws1, message)
    wsConnection.sendMessageToUser(ws2, message)

    return session.data
}

export async function getMatchDetails(request: ITypedBodyRequest<void>, response: Response): Promise<void> {
    const userId = request.user.id
    const matchId = request.params.id
    const match = await getMatchByUserIdandMatchId(userId, matchId)

    if (!match) {
        response.status(404).send('MATCH_NOT_FOUND')
        return
    }

    response.status(200).send(match)
}

export async function updateCompletion(
    request: ITypedBodyRequest<{ matchId: string }>,
    response: Response
): Promise<void> {
    const matchId = request.body.matchId
    const match = await updateMatchCompletion(matchId)
    if (!match) {
        response.status(404).send('MATCH_NOT_FOUND')
        return
    }
    response.status(200).send('MATCH_COMPLETED')
}

export async function handleGetPaginatedSessions(request: IPaginationRequest, response: Response): Promise<void> {
    const page = parseInt(request.query.page)
    const limit = parseInt(request.query.limit)
    const userId = request.user.id

    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
        response.status(400).json('INVALID_PAGINATION').send()
        return
    }
    const start = (page - 1) * limit
    const sortBy = request.query.sortBy?.split(',').map((sort) => sort.split(':')) ?? []
    const isSortsValid = sortBy.every(
        (sort: string[]) => sort.at(0) && sort.at(1) && isValidSort(sort.at(0)!, sort.at(1)!)
    )

    if (!isSortsValid) {
        response.status(400).json('INVALID_SORT').send()
        return
    }
    const count = await findMatchCount()
    let matches: IMatch[]

    if (sortBy.length) {
        matches = await findPaginatedMatchesWithSort(start, limit, sortBy, userId)
    } else {
        matches = await findPaginatedMatches(start, limit, userId)
    }

    const nextPage = start + limit < count ? page + 1 : null

    response.status(200).json({
        pagination: {
            currentPage: page,
            nextPage,
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            limit,
        },
        sessions: matches,
    })
}

export async function handleIsUserInMatch(request: ITypedBodyRequest<void>, response: Response): Promise<void> {
    if (!request.query.userId) {
        response.status(400).send('MISSING_USER_ID')
        return
    }
    const userMatch = await findOngoingMatch(request.query.userId.toString())
    response.status(200).send({
        data: userMatch,
    })
}

export async function handleGetCompletedQuestionCounts(request: Request, response: Response): Promise<void> {
    const userId = request.params.id
    const counts = await findCompletedQuestionCount(userId)
    response.status(200).json(counts).send()
}
