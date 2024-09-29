'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { InputField, OTPField } from '../customs/custom-input'
import { sendResetPasswordEmail, verifyEmail } from '@/services/user-service-api'
import validateInput, { initialFormValues } from '@/util/input-validation'

import { Button } from '@/components/ui/button'
import { ResetPasswordSteps } from '@/types/reset-password'
import { toast } from 'sonner'
import usePasswordToggle from '../../hooks/UsePasswordToggle'
import { useState } from 'react'

export function PasswordReset() {
    const [open, setOpen] = useState(false)
    const [formStep, setFormStep] = useState<ResetPasswordSteps>(ResetPasswordSteps.Step1)
    const [formValues, setFormValues] = useState({ ...initialFormValues })
    const [formErrors, setFormErrors] = useState({ ...initialFormValues })
    const [passwordInputType, passwordToggleIcon] = usePasswordToggle()
    const [confirmPasswordInputType, confirmPasswordToggleIcon] = usePasswordToggle()

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { id, value } = e.target
        setFormValues({ ...formValues, [id]: value })
    }

    const onEnterEmail = async () => {
        const isTest = {
            email: true,
            loginPassword: false,
            password: false,
            username: false,
            confirmPassword: false,
            proficiency: false,
            otp: false,
        }

        const [errors, isValid] = validateInput(isTest, formValues)
        setFormErrors(errors)

        if (isValid) {
            try {
                const requestBody = { email: formValues.email }
                const status = await sendResetPasswordEmail(requestBody)
                if (status === 400) {
                    toast.success('Email has been sent already. Please check your email.')
                } else {
                    toast.success('Email sent successfully!')
                }
                setFormStep(ResetPasswordSteps.Step2)
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message)
                }
            }
        }
    }

    const onEnterOTP = async () => {
        const isTest = {
            email: false,
            loginPassword: false,
            password: false,
            username: false,
            confirmPassword: false,
            proficiency: false,
            otp: true,
        }

        const [errors, isValid] = validateInput(isTest, formValues)
        setFormErrors(errors)

        if (isValid) {
            try {
                const requestBody = { email: formValues.email, verificationToken: formValues.otp }
                await verifyEmail(requestBody)
                toast.success('OTP verified successfully!')
                setFormStep(ResetPasswordSteps.Step3)
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message)
                }
            }
        }
    }

    const onReset = async () => {
        const isTest = {
            email: false,
            loginPassword: false,
            password: true,
            username: false,
            confirmPassword: true,
            proficiency: false,
            otp: false,
        }

        const [errors, isValid] = validateInput(isTest, formValues)
        setFormErrors(errors)

        if (isValid) {
            toast.success('Password reset successfully!')
            setFormStep(ResetPasswordSteps.Step1)
            setOpen(false)
            setFormValues({ ...initialFormValues })
        }
    }

    const enterResetEmail = (
        <DialogContent className="min-h-[300px] sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Forgot your password</DialogTitle>
                <DialogDescription>
                    Enter your email address below and we will send you an otp to reset your password.
                </DialogDescription>
            </DialogHeader>
            <InputField
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formValues.email}
                onChange={handleFormChange}
                error={formErrors.email}
                className="w-full py-3 px-3 border bg-[#EFEFEF] rounded-[5px]"
            />
            <DialogFooter>
                <Button type="submit" className="bg-purple-600 hover:bg-[#A78BFA]" onClick={onEnterEmail}>
                    Send Email
                </Button>
            </DialogFooter>
        </DialogContent>
    )

    const enterOTP = (
        <DialogContent className="min-h-[300px] sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Enter your OTP</DialogTitle>
                <DialogDescription>Enter the OTP sent to your email address to reset your password.</DialogDescription>
            </DialogHeader>
            <div className="flex justify-center">
                <OTPField
                    id="otp"
                    value={formValues.otp}
                    onChange={(o: string) => setFormValues({ ...formValues, otp: o })}
                    error={formErrors.otp}
                />
            </div>
            <DialogFooter>
                <Button type="submit" className="bg-purple-600 hover:bg-[#A78BFA]" onClick={onEnterOTP}>
                    Verify
                </Button>
            </DialogFooter>
        </DialogContent>
    )

    const enterNewPassword = (
        <DialogContent className="min-h-[375px] sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Create your new password</DialogTitle>
                <DialogDescription>Enter your new password below.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2 h-full">
                <InputField
                    id="password"
                    type={passwordInputType}
                    placeholder="Enter new password"
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
                    placeholder="Confirm your new password"
                    icon={confirmPasswordToggleIcon}
                    value={formValues.confirmPassword}
                    onChange={handleFormChange}
                    error={formErrors.confirmPassword}
                    className="w-full py-3 px-3 border bg-[#EFEFEF] rounded-[5px]"
                    page="auth"
                />
            </div>
            <DialogFooter>
                <Button type="submit" className="bg-purple-600 hover:bg-[#A78BFA]" onClick={onReset}>
                    Reset Password
                </Button>
            </DialogFooter>
        </DialogContent>
    )

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <p className="underline cursor-pointer">Forgot your password?</p>
            </DialogTrigger>
            {formStep === ResetPasswordSteps.Step1
                ? enterResetEmail
                : formStep === ResetPasswordSteps.Step2
                  ? enterOTP
                  : enterNewPassword}
        </Dialog>
    )
}
