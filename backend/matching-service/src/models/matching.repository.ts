import { Model, model, SortOrder } from 'mongoose'
import matchSchema from './matching.model'
import { IMatch } from '@repo/user-types'
import { MatchDto } from '../types/MatchDto'

const matchModel: Model<IMatch> = model('Match', matchSchema)

export async function createMatch(dto: MatchDto): Promise<IMatch> {
    return matchModel.create(dto)
}

export async function isUserInMatch(userId: string): Promise<string | undefined> {
    const match = await matchModel.findOne({
        $or: [{ user1Id: userId }, { user2Id: userId }],
        $and: [{ isCompleted: false }],
    })
    return match?.id
}

export async function getMatchByUserIdandMatchId(userId: string, matchId: string): Promise<IMatch> {
    return matchModel.findOne({
        $or: [{ user1Id: userId }, { user2Id: userId }],
        $and: [{ _id: matchId }],
    })
}

export async function updateMatchCompletion(matchId: string): Promise<boolean> {
    const match = await matchModel.updateOne({ _id: matchId }, { isCompleted: true })
    return !!match
}

export async function findPaginatedMatches(start: number, limit: number, userId: string): Promise<IMatch[]> {
    return matchModel
        .find({
            $or: [{ user1Id: userId }, { user2Id: userId }],
        })
        .limit(limit)
        .skip(start)
}

export async function findPaginatedMatchesWithSort(
    start: number,
    limit: number,
    sortBy: string[][],
    userId: string
): Promise<IMatch[]> {
    return matchModel
        .find({
            $or: [{ user1Id: userId }, { user2Id: userId }],
        })
        .sort(sortBy.map(([key, order]): [string, SortOrder] => [key, order as SortOrder]))
        .limit(limit)
        .skip(start)
}

export function getSortKeysAndOrders(): { keys: string[]; orders: string[] } {
    return { keys: ['complexity', 'createdAt'], orders: ['asc', 'desc'] }
}

export function isValidSort(key: string, order: string): boolean {
    const { keys, orders } = getSortKeysAndOrders()
    return orders.includes(order) && keys.includes(key)
}

export async function findMatchCount(): Promise<number> {
    return matchModel.countDocuments()
}

export async function findOngoingMatch(userId: string): Promise<IMatch> {
    const match = await matchModel.findOne({
        $or: [{ user1Id: userId }, { user2Id: userId }],
        $and: [{ isCompleted: false }],
    })
    return match
}
