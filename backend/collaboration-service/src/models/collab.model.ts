import { Schema } from 'mongoose'
import { CollabDto } from '../types/CollabDto'
import { LanguageMode } from '@repo/collaboration-types'
import chatModelSchema from './chat.model'

const collabSchema = new Schema<CollabDto>({
    language: {
        type: String,
        enum: Object.values(LanguageMode),
        required: true,
    },
    code: {
        type: String,
        required: false,
    },
    executionResult: {
        type: String,
        required: false,
    },
    chatHistory: {
        type: [chatModelSchema],
        required: false,
        default: [],
    },
    createdAt: {
        type: Date,
        required: true,
    },
})

export default collabSchema
