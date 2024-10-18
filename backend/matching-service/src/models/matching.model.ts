import { Schema } from 'mongoose'

const matchSchema = new Schema({
    user1Id: {
        type: String,
        required: true,
    },
    user2Id: {
        type: String,
        required: true,
    },
    questionId: {
        type: String,
        required: true,
    },
    isCompleted: {
        type: Boolean,
        required: true,
    },
    matchToken: {
        type: String,
        required: true,
        unique: true,
    },
    complexity: {
        type: Number,
        required: true, // Assuming complexity is a numerical value
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

// Create a compound index for 'complexity' and 'createdAt'
matchSchema.index({ complexity: 1, createdAt: -1 }) // 1 for ascending, -1 for descending order

export default matchSchema
