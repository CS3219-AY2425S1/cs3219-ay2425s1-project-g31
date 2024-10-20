import { IQuestionDto } from '@repo/question-types'
import axios from 'axios'
import config from '../common/config.util'
import { Category, Complexity } from '@repo/user-types'

// Note: not tested yet as not required for this milestone
export async function getRandomQuestion(
    topic: Category,
    complexity: Complexity,
    accessToken: string
): Promise<IQuestionDto> {
    const response = await axios.get<IQuestionDto>(
        `${config.QUESTION_SERVICE_URL}/questions/random-question/?topic=${topic}&complexity=${complexity}`,
        {
            headers: { authorization: accessToken },
        }
    )
    return response.data
}
