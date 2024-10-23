import { Schema } from 'mongoose'
import { ICollab } from '../types/ICollab'

const collabSchema = new Schema<ICollab>({
    user1Id: {
        type: String,
        required: true,
    },
    user1Name: {
        type: String,
        required: true,
    },
    user2Id: {
        type: String,
        required: true,
    },
    user2Name: {
        type: String,
        required: true,
    },
    matchId: {
        type: String,
        required: true,
        unique: true,
    },
    question: {
        type: Object,
        required: true,
    },
    isCompleted: {
        type: Boolean,
        required: true,
    },
    code: {
        type: Object,
        required: false,
    },
    chat: {
        type: Object,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

export default collabSchema
