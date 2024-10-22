import { Model, model } from 'mongoose'
import matchSchema from './matching.model'
import { IMatch } from '../types/IMatch'
import { MatchDto } from '../types/MatchDto'

const matchModel: Model<IMatch> = model('Match', matchSchema)

export async function createMatch(dto: MatchDto): Promise<IMatch> {
    return matchModel.create(dto)
}

export async function isUserInMatch(userId: string): Promise<boolean> {
    const match = await matchModel.findOne({
        $or: [{ user1Id: userId }, { user2Id: userId }],
        $and: [{ isCompleted: false }],
    })
    return !!match
}

export async function getMatchById(matchId: string): Promise<IMatch> {
    return matchModel.findById(matchId)
}
