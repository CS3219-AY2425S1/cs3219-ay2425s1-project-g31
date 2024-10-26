import { Model, model } from 'mongoose'
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

export async function getMatchById(matchId: string): Promise<IMatch> {
    return matchModel.findById(matchId)
}

export async function getMatchByUserId(userId: string): Promise<IMatch> {
    return matchModel.findOne({
        $or: [{ user1Id: userId }, { user2Id: userId }],
        $and: [{ isCompleted: false }],
    })
}
