import { Category, IUserDto } from '@repo/user-types'
import axios, { AxiosResponse } from 'axios'
import config from '../common/config.util'
import { IQuestionDto, SortedComplexity } from '@repo/question-types'

export async function getUserById(id: string, accessToken: string): Promise<IUserDto> {
    const response = await axios.get<IUserDto>(`${config.USER_SERVICE_URL}/users/${id}`, {
        headers: { authorization: accessToken },
    })
    return response.data
}

export async function getMatch(matchId: string, accessToken: string): Promise<AxiosResponse> {
    return await axios.get(`${config.MATCHING_SERVICE_URL}/matching/${matchId}`, {
        headers: { authorization: accessToken },
    })
}

export async function getRandomQuestion(
    topic: Category,
    complexity: SortedComplexity,
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
