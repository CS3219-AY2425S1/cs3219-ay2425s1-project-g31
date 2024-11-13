import { IErrorFormInput, IValidateFormInput, IValidateFormInputBoolean } from '@/types/forms'
import { Proficiency } from '@repo/user-types'

export const initialFormValues: IValidateFormInput = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    proficiency: Proficiency.BEGINNER,
    loginPassword: '',
    otp: '',
}

const validateInput = (test: IValidateFormInputBoolean, testValue: IValidateFormInput): [IErrorFormInput, boolean] => {
    let isValid = true
    const errors: IErrorFormInput = { ...initialFormValues, proficiency: '' }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
    const otpRegex = /^[0-9]{6}$/

    if (test.username) {
        if (!testValue.username) {
            errors.username = 'Please Enter a username!'
            isValid = false
        }
    }

    if (test.email) {
        const validateEmail = (email: string): boolean => emailRegex.test(email)
        if (!testValue.email) {
            errors.email = 'Email is required!'
            isValid = false
        } else if (!validateEmail(testValue.email)) {
            errors.email = 'Invalid Email!'
            isValid = false
        }
    }

    if (test.password) {
        const validatePassword = (password: string): boolean => passwordRegex.test(password)
        if (!testValue.password) {
            errors.password = 'Password is required!'
            isValid = false
        } else if (!validatePassword(testValue.password)) {
            errors.password =
                'Weak password, please ensure you have at least 8 characters, one upper and lower case letter, one digit and one special character.'
            isValid = false
        }
    }

    if (test.confirmPassword) {
        if (!testValue.confirmPassword) {
            errors.confirmPassword = 'Please re-enter your password!'
            isValid = false
        } else if (testValue.password !== testValue.confirmPassword) {
            errors.confirmPassword = "Passwords don't match!"
            isValid = false
        }
    }

    if (test.proficiency) {
        if (!Object.values(Proficiency).includes(testValue.proficiency)) {
            errors.proficiency = 'Please choose a proficiency level!'
            isValid = false
        }
    }

    if (test.loginPassword) {
        if (!testValue.loginPassword) {
            errors.loginPassword = 'Password is required!'
            isValid = false
        }
    }

    if (test.otp) {
        if (!testValue.otp) {
            errors.otp = 'Please enter the OTP!'
            isValid = false
        } else if (!otpRegex.test(testValue.otp)) {
            errors.otp = 'Invalid OTP!'
            isValid = false
        }
    }

    return [errors, isValid]
}

export default validateInput
