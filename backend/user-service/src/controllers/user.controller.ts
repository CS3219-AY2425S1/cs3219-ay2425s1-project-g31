import { ITypedBodyRequest } from '@repo/request-types'
import { ValidationError } from 'class-validator'
import { Response } from 'express'
import { hashPassword } from '../common/password.util'
import {
    createUser,
    deleteUser,
    findOneUserById,
    findOneUserByUsername,
    findUsersByUsernameAndEmail,
    updateUser,
} from '../models/user.repository'
import { CreateUserDto } from '../types/CreateUserDto'
import { IUser } from '../types/IUser'
import { UserDto } from '../types/UserDto'
import { UserPasswordDto } from '../types/UserPasswordDto'
import { UserProfileDto } from '../types/UserProfileDto'

export async function handleCreateUser(request: ITypedBodyRequest<CreateUserDto>, response: Response): Promise<void> {
    const createDto = CreateUserDto.fromRequest(request)
    const errors = await createDto.validate()
    if (errors.length) {
        const errorMessages = errors.map((error: ValidationError) => `INVALID_${error.property.toUpperCase()}`)
        response.status(400).json(errorMessages).send()
        return
    }

    const duplicate = await findUsersByUsernameAndEmail(createDto.username, createDto.email)
    if (duplicate.find((user: IUser) => user.username === createDto.username)) {
        response.status(409).json('DUPLICATE_USERNAME')
        return
    }
    if (duplicate.find((user: IUser) => user.email === createDto.email)) {
        response.status(409).json('DUPLICATE_EMAIL')
        return
    }

    createDto.password = await hashPassword(createDto.password)
    const user = await createUser(createDto)
    const dto = UserDto.fromModel(user)

    response.status(201).json(dto).send()
}

export async function handleUpdateProfile(
    request: ITypedBodyRequest<UserProfileDto>,
    response: Response
): Promise<void> {
    const createDto = UserProfileDto.fromRequest(request)
    const errors = await createDto.validate()
    if (errors.length) {
        const errorMessages = errors.map((error: ValidationError) => `INVALID_${error.property.toUpperCase()}`)
        response.status(400).json(errorMessages).send()
        return
    }

    const id = request.params.id

    const duplicateUsername = await findOneUserByUsername(createDto.username)
    if (duplicateUsername && duplicateUsername.id !== id) {
        response.status(409).json(['DUPLICATE_USERNAME']).send()
        return
    }

    const updatedUser = await updateUser(id, createDto)
    if (!updatedUser) {
        response.status(404).send()
        return
    }
    const dto = UserDto.fromModel(updatedUser)
    response.status(200).json(dto).send()
}

export async function handleGetCurrentProfile(
    request: ITypedBodyRequest<UserProfileDto>,
    response: Response
): Promise<void> {
    const id = request.params.id

    const user = await findOneUserById(id)
    if (!user) {
        response.status(404).send()
    } else {
        const dto = UserDto.fromModel(user)
        response.status(200).json(dto).send()
    }
}

export async function handleDeleteUser(request: ITypedBodyRequest<void>, response: Response): Promise<void> {
    const id = request.params.id
    await deleteUser(id)
    response.status(204).send()
}

export async function handleUpdatePassword(
    request: ITypedBodyRequest<UserPasswordDto>,
    response: Response
): Promise<void> {
    const createDto = UserPasswordDto.fromRequest(request)
    const errors = await createDto.validate()
    if (errors.length) {
        const errorMessages = errors.map((error: ValidationError) => `INVALID_${error.property.toUpperCase()}`)
        response.status(400).json(errorMessages).send()
        return
    }

    const id = request.params.id
    createDto.password = await hashPassword(createDto.password)

    const updatedUser = await updateUser(id, createDto)
    if (!updatedUser) {
        response.status(404).send()
        return
    }
    const dto = UserDto.fromModel(updatedUser)
    response.status(200).json(dto).send()
}
