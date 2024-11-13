import { Schema } from 'mongoose'
import { Category } from '../types/Category'
import { Complexity } from '../types/Complexity'
import { IQuestion } from '../types/IQuestion'

const questionSchema = new Schema<IQuestion>(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        categories: {
            type: [String],
            enum: Object.values(Category),
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
        link: {
            type: String,
            required: true,
            unique: true,
        },
        testInputs: {
            type: [String],
            required: true,
        },
        testOutputs: {
            type: [String],
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

// This should cover most possible queries, note that text indexes cannot include multikey indexes, so we need to create separate indexes for title and categories

// Index to support text search by title and sorting by complexity
questionSchema.index({ title: 'text', complexity: 1 })
// Index to support filter by categories and sorting by complexity, including prefixes where we filter by categories only
questionSchema.index({ categories: 1, complexity: 1 })
// Index to support sorting by complexity only
questionSchema.index({ complexity: 1 })

export default questionSchema
