import { ValidationError } from 'class-validator'
import { Request, Response } from 'express'
import { ITypedBodyRequest } from '@repo/request-types'
import { ISubmission, SubmissionRequestDto, SubmissionResponseDto } from '@repo/submission-types'
import { CollabDto } from '../types/CollabDto'
import { createSession, getSessionById } from '../models/collab.repository'
import judgeZero from '../services/judgezero.service'

export async function createSessionRequest(request: ITypedBodyRequest<CollabDto>, response: Response): Promise<void> {
    const collabDto = CollabDto.fromRequest(request)
    const errors = await collabDto.validate()
    if (errors.length) {
        const errorMessages = errors.flatMap((error: ValidationError) => Object.values(error.constraints))
        response.status(400).json(errorMessages).send()
        return
    }

    // Check if session already exists
    const duplicate = await getSessionById(collabDto.matchId)

    if (duplicate) {
        response.status(409).json('A session has already been created').send()
        return
    }

    // Create session
    const session = await createSession(collabDto)

    if (!session) {
        response.status(400).json('Issues with creating server. Please try again.').send()
        return
    }

    // Return session added to db
    response.status(200).json(session).send()
}

export async function getSession(request: Request, response: Response): Promise<void> {
    const id = request.params.id

    // Obtains session by _id
    const session = await getSessionById(id)

    if (!session) {
        response.status(404).json(`Session with id ${id} does not exist!`).send()
        return
    }

    // Send retrieved data
    response.status(200).json(session).send()
}

export async function getChatHistory(request: Request, response: Response): Promise<void> {
    const id = request.params.id

    // Obtains session by _id
    const session = await getSessionById(id)

    if (!session) {
        response.status(404).json(`Session with id ${id} does not exist!`).send()
        return
    }

    // Send retrieved data
    response.status(200).json(session.chatHistory).send()
}

export async function submitCode(dto: ISubmission): Promise<SubmissionResponseDto> {
    const submissionRequestDto = new SubmissionRequestDto(
        dto.language_id,
        dto.source_code,
        dto.expected_output,
        dto.stdin
    )
    const requestErrors = await submissionRequestDto.validate()

    if (requestErrors.length) {
        const errorMessages = requestErrors.flatMap((error: ValidationError) => Object.values(error.constraints))
        throw new Error(errorMessages.join('\n'))
    }

    const res = await judgeZero.post('/submissions?base64_encoded=false&wait=true', submissionRequestDto)

    if (!res) {
        throw new Error('Failed to submit code. Please try again.')
    }

    const submissionResponseDto = SubmissionResponseDto.fromResponse(res)
    const responseErrors = await submissionResponseDto.validate()

    if (responseErrors.length) {
        const errorMessages = responseErrors.flatMap((error: ValidationError) => Object.values(error.constraints))
        throw new Error(errorMessages.join('\n'))
    }

    console.log(submissionResponseDto)

    return submissionResponseDto
}
