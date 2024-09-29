'use client'

import validateInput, { initialFormValues } from '@/util/input-validation'

import { Button } from '../ui/button'
import { InputField } from '../customs/custom-input'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import usePasswordToggle from '../../hooks/UsePasswordToggle'
import { useState } from 'react'
import { signUpRequest } from '@/services/user-service-api'
import { Proficiency, Role } from '@repo/user-types'
import { ICreateUser } from '@/types/axios-user-types'
import React from 'react'

export default function Signup() {
    const [formValues, setFormValues] = useState({ ...initialFormValues })
    const [formErrors, setFormErrors] = useState({ ...initialFormValues, proficiency: '' })
    const [isLoading, setIsLoading] = useState(false)
    const [passwordInputType, passwordToggleIcon] = usePasswordToggle()
    const [confirmPasswordInputType, confirmPasswordToggleIcon] = usePasswordToggle()

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { id, value } = e.target
        setFormValues({ ...formValues, [id]: value })
    }

    const onSignup = async () => {
        const isTest = {
            username: true,
            email: true,
            password: true,
            confirmPassword: true,
            proficiency: false,
            loginPassword: false,
            otp: false,
        }
        const [errors, isValid] = validateInput(isTest, formValues)
        setFormErrors(errors)
        if (isValid) {
            const requestBody: ICreateUser = {
                ...formValues,
                proficiency: Proficiency.BEGINNER,
                role: Role.USER,
            }
            try {
                setIsLoading(true)
                await signUpRequest(requestBody)
                toast.success('Signed up successfully!')
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message)
                }
            } finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <>
            <InputField
                id="username"
                type="text"
                placeholder="Username"
                value={formValues.username}
                onChange={handleFormChange}
                error={formErrors.username}
                className="w-full py-3 px-3 border bg-[#EFEFEF] rounded-[5px]"
            />

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
                id="password"
                type={passwordInputType}
                placeholder="Password"
                icon={passwordToggleIcon}
                value={formValues.password}
                onChange={handleFormChange}
                error={formErrors.password}
                className="w-full py-3 px-3 border bg-[#EFEFEF] rounded-[5px]"
                page="auth"
            />

            <InputField
                id="confirmPassword"
                type={confirmPasswordInputType}
                placeholder="Confirm Password"
                icon={confirmPasswordToggleIcon}
                value={formValues.confirmPassword}
                onChange={handleFormChange}
                error={formErrors.confirmPassword}
                className="w-full py-3 px-3 border bg-[#EFEFEF] rounded-[5px]"
                page="auth"
            />

            {isLoading ? (
                <Button disabled variant="primary" className="w-full text-md mt-5 h-[42px]">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                </Button>
            ) : (
                <Button onClick={onSignup} variant="primary" className="w-full text-md mt-5 h-[42px]">
                    Sign Up
                </Button>
            )}

            <p className="text-sm text-center text-gray-500 mt-2 px-6">
                By clicking Sign up, you agree to our Terms of Service and Privacy Policy
            </p>
        </>
    )
}
