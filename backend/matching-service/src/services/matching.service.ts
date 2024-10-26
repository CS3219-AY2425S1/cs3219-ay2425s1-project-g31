import { Category, IUserDto, SortedComplexity } from '@repo/user-types'
// import { IQuestionDto } from '@repo/question-types'
import axios from 'axios'
import config from '../common/config.util'

export async function getUserById(id: string, accessToken: string): Promise<IUserDto> {
    const response = await axios.get<IUserDto>(`${config.USER_SERVICE_URL}/users/${id}`, {
        headers: { authorization: accessToken },
    })
    return response.data
}

export async function getRandomQuestion(topic: Category, complexity: SortedComplexity): Promise<string> {
    const response = await axios.get<string>(
        `${config.QUESTION_SERVICE_URL}/questions/random-question/?topic=${topic}&complexity=${complexity.toString()}`
    )
    return response.data
}
