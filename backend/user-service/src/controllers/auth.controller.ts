import { IAuthenticatedRequest, ITypedBodyRequest } from '@repo/request-types'
import { generateOTP, sendMail } from '../common/mail.util'
import { findOneUserByEmail, updateUser } from '../models/user.repository'
import { ValidationError } from 'class-validator'
import { Response } from 'express'
import { hashPassword } from '../common/password.util'
import { getHTMLTemplate } from '../common/template.util'
import { generateAccessToken } from '../common/token.util'
import { EmailVerificationDto } from '../types/EmailVerificationDto'
import { UpdatePasswordDto } from '../types/UpdatePasswordDto'

export async function handleLogin({ user }: IAuthenticatedRequest, response: Response): Promise<void> {
    const accessToken = await generateAccessToken(user)
    response
        .status(201)
        .json({
            ...user,
            accessToken,
        })
        .send()
}

export async function handleReset(request: ITypedBodyRequest<EmailVerificationDto>, response: Response): Promise<void> {
    const createDto = EmailVerificationDto.fromRequest(request)
    createDto.verificationToken = '0'
    const errors = await createDto.validate()
    if (errors.length) {
        const errorMessages = errors.flatMap((error: ValidationError) => Object.values(error.constraints))
        response.status(400).json(errorMessages).send()
        return
    }

    const user = await findOneUserByEmail(createDto.email)

    if (!user) {
        response.status(404).json('USER_NOT_FOUND').send()
        return
    }
    if (user.verificationToken !== '0') {
        response.status(400).json('TOKEN_ALREADY_SENT').send()
        return
    }

    const otp = generateOTP()
    createDto.verificationToken = otp

    await updateUser(user.id, createDto)

    const htmlFile = await getHTMLTemplate('../../public/passwordResetEmail.html')
    await sendMail(user.email, 'Password Reset Request', 'PeerPrep', htmlFile.replace('{otp}', otp))

    response.status(200).send()
}

export async function handleVerify(
    request: ITypedBodyRequest<EmailVerificationDto>,
    response: Response
): Promise<void> {
    const createDto = EmailVerificationDto.fromRequest(request)
    const errors = await createDto.validate()
    if (errors.length) {
        const errorMessages = errors.flatMap((error: ValidationError) => Object.values(error.constraints))
        response.status(400).json(errorMessages).send()
        return
    }

    const user = await findOneUserByEmail(createDto.email)

    if (!user) {
        response.status(404).json('USER_NOT_FOUND').send()
        return
    }

    if (user.verificationToken == '0' || user.verificationToken !== createDto.verificationToken) {
        response.status(400).json('INVALID_OTP').send()
        return
    }

    await updateUser(user.id, createDto)

    response.status(200).send()
}

export async function handleUpdate(request: ITypedBodyRequest<UpdatePasswordDto>, response: Response): Promise<void> {
    const createDto = UpdatePasswordDto.fromRequest(request)
    const errors = await createDto.validate()
    if (errors.length) {
        const errorMessages = errors.flatMap((error: ValidationError) => Object.values(error.constraints))
        response.status(400).json(errorMessages).send()
        return
    }

    createDto.password = await hashPassword(createDto.password)

    const user = await findOneUserByEmail(createDto.email)

    if (!user) {
        response.status(404).json('USER_NOT_FOUND').send()
        return
    }

    if (user.verificationToken == '0' || user.verificationToken !== createDto.verificationToken) {
        response.status(400).json('INVALID_OTP').send()
        return
    }

    createDto.verificationToken = '0'
    await updateUser(user.id, createDto)

    response.status(200).send()
}
