import { Schema } from 'mongoose'
import { ChatModel } from '@repo/collaboration-types'

const chatModelSchema = new Schema<ChatModel>({
    senderId: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
})

export default chatModelSchema
