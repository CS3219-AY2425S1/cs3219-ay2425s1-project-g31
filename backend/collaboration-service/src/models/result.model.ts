import { Schema } from 'mongoose'
import { ResultModel } from '@repo/collaboration-types'

const executionResultSchema = new Schema<ResultModel>({
    time: {
        type: String,
        required: false,
    },
    status: {
        type: Object,
        required: false,
    },
    stderr: {
        type: String,
        required: false,
    },
    compile_output: {
        type: String,
        required: false,
    },
    stdout: {
        type: String,
        required: false,
    },
    testIndex: {
        type: Number,
        required: false,
    },
})

export default executionResultSchema
