import { IUserDto } from '@repo/user-types'
import axios from 'axios'
import config from '../common/config.util'

export async function getUserById(id: string, accessToken: string): Promise<IUserDto> {
    const response = await axios.get<IUserDto>(`${config.USER_SERVICE_URL}/users/${id}`, {
        headers: { authorization: accessToken },
    })
    return response.data
}

export async function completeCollaborationSession(matchId: string): Promise<void> {
    await axios.put(`${config.MATCHING_SERVICE_URL}/matching`, { matchId })
}
