import { model, Model } from 'mongoose'
import { ICollab } from '../types/ICollab'
import collabSchema from './collab.model'
import { CollabDto } from '../types/CollabDto'

const collabModel: Model<ICollab> = model('Match', collabSchema)

export async function createCollab(dto: CollabDto): Promise<ICollab> {
    return collabModel.create(dto)
}

export async function getCollabByMatchId(matchId: string): Promise<ICollab> {
    return collabModel.findOne({ match: matchId })
}
