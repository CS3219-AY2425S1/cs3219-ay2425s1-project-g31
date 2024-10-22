import { Category, Complexity } from '@repo/user-types'
import { Schema } from 'mongoose'
import { IMatch } from '../types/IMatch'

const matchSchema = new Schema<IMatch>({
    user1Id: {
        type: String,
        required: true,
    },
    user2Id: {
        type: String,
        required: true,
    },
    isCompleted: {
        type: Boolean,
        required: true,
    },
    complexity: {
        type: String,
        enum: Object.values(Complexity).map((value: Complexity): string => {
            switch (value) {
                case Complexity.EASY:
                    return `1${value}`
                case Complexity.MEDIUM:
                    return `2${value}`
                case Complexity.HARD:
                    return `3${value}`
                default:
                    return `1${Complexity.EASY}`
            }
        }),
        required: true,
        // We need to prepend a number to the enum values so that their lexicographical ordering is the same as their logical ordering when they are sorted by the index
        set: (value: Complexity): string => {
            switch (value) {
                case Complexity.EASY:
                    return `1${value}`
                case Complexity.MEDIUM:
                    return `2${value}`
                case Complexity.HARD:
                    return `3${value}`
                default:
                    return `1${Complexity.EASY}`
            }
        },
        get: (value: string): Complexity => {
            switch (value) {
                case '1EASY':
                    return Complexity.EASY
                case '2MEDIUM':
                    return Complexity.MEDIUM
                case '3HARD':
                    return Complexity.HARD
                default:
                    return Complexity.EASY
            }
        },
    },
    category: {
        type: String,
        enum: Object.values(Category),
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

// Create a compound index for 'complexity' and 'createdAt'
matchSchema.index({ complexity: 1, createdAt: -1 }) // 1 for ascending, -1 for descending order

export default matchSchema
