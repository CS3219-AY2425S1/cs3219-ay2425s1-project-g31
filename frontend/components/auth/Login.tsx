'use client'

import validateInput, { initialFormValues } from '@/util/input-validation'

import { Button } from '../ui/button'
import { InputField } from '../customs/custom-input'
import { PasswordReset } from './PasswordReset'
import { toast } from 'sonner'
import usePasswordToggle from '../../hooks/UsePasswordToggle'
import { useState } from 'react'
import { loginRequest } from '@/services/user-service-api'
import { useSetRecoilState } from 'recoil'
import { tokenState, userState } from '@/atoms/auth'
import { useRouter } from 'next/router'
import React from 'react'
import { ILoginUserResponse } from '@/types/axios-types'

export default function Login() {
    const [formValues, setFormValues] = useState({ ...initialFormValues })
    const [formErrors, setFormErrors] = useState({ ...initialFormValues })
    const [passwordInputType, passwordToggleIcon] = usePasswordToggle()
    const setIsAuth = useSetRecoilState(userState)
    const setIsValid = useSetRecoilState(tokenState)

    const router = useRouter()

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { id, value } = e.target
        setFormValues({ ...formValues, [id]: value })
    }

    const onLogin = async () => {
        const isTest = {
            email: true,
            loginPassword: true,
            password: false,
            username: false,
            confirmPassword: false,
            proficiency: false,
            otp: false,
        }

        const [errors, isValid] = validateInput(isTest, formValues)
        setFormErrors(errors)

        if (isValid) {
            const requestBody = {
                usernameOrEmail: formValues.email,
                password: formValues.loginPassword,
            }
            try {
                const res = await loginRequest(requestBody)
                if (res) {
                    sessionStorage.setItem('id', res.id)
                    sessionStorage.setItem('username', res.username)
                    sessionStorage.setItem('email', res.email)
                    sessionStorage.setItem('TTL', new Date().toString())
                    sessionStorage.setItem('isAuth', 'true')
                    setIsAuth(true)
                    setIsValid(true)
                    router.push('/')
                    toast.success('Logged in successfully')
                }
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message)
                }
            }
        }
    }

    return (
        <>
            <InputField
                id="email"
                type="text"
                placeholder="Email"
                value={formValues.email}
                onChange={handleFormChange}
                error={formErrors.email}
                className="w-full py-3 px-3 border bg-[#EFEFEF] rounded-[5px]"
            />

            <InputField
                id="loginPassword"
                type={passwordInputType}
                placeholder="Password"
                icon={passwordToggleIcon}
                value={formValues.loginPassword}
                onChange={handleFormChange}
                error={formErrors.loginPassword}
                className="w-full py-3 px-3 border bg-[#EFEFEF] rounded-[5px]"
                page="auth"
            />

            <Button onClick={onLogin} variant="primary" className="w-full text-md mt-5 h-[42px]">
                Login
            </Button>
            <PasswordReset />
        </>
    )
}
