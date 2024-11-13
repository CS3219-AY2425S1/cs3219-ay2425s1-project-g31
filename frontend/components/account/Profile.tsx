import { InputField, OptionsField } from '../customs/custom-input'
import validateInput, { initialFormValues } from '@/util/input-validation'

import CustomDialogWithButton from '../customs/custom-dialog'
import { Proficiency } from '@repo/user-types'
import React from 'react'
import { toast } from 'sonner'
import { updateProfile } from '@/services/user-service-api'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

function Profile() {
    const { data: session, update } = useSession()
    const defaultUsername = session?.user.username ?? ''
    const [formValues, setFormValues] = useState({
        ...initialFormValues,
        username: defaultUsername,
        proficiency: session?.user.proficiency as Proficiency,
    })
    const [formErrors, setFormErrors] = useState({ ...initialFormValues, proficiency: '' })
    const [isDialogOpen, toggleDialogOpen] = useState(false)
    const [isFormSubmit, setIsFormSubmit] = useState(false)

    const handleUsernameChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>): void => {
        const { id, value } = e.target
        setFormValues({ ...formValues, [id]: value })
    }

    const handleProficiencyChange = (e: string): void => {
        setFormValues({ ...formValues, proficiency: e.toUpperCase() as Proficiency })
    }

    const handleFormSubmit = async () => {
        setIsFormSubmit(true)
        toggleDialogOpen(false)
        const userData = { username: formValues.username, proficiency: formValues.proficiency }
        try {
            const response = await updateProfile(session?.user.id ?? '', userData)
            if (response) {
                const proficiency = Object.values(Proficiency).includes(response.proficiency as Proficiency)
                    ? response.proficiency
                    : Proficiency.BEGINNER
                setFormValues({
                    ...formValues,
                    username: response.username ?? '',
                    proficiency: proficiency,
                })
                update({
                    ...session,
                    user: { ...session?.user, username: response.username, proficiency: proficiency },
                })
                toast.success('Profile has been updated successfully.')
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
            }
        }
    }

    const handleUpdateClick = (): void => {
        const isTest = {
            username: true,
            email: false,
            password: false,
            confirmPassword: false,
            proficiency: true,
            loginPassword: false,
            otp: false,
        }
        const [errors, isValid] = validateInput(isTest, formValues)
        setFormErrors(errors)
        if (isValid) {
            toggleDialogOpen(true)
        }
    }

    const manageDialog = (): void => {
        if (isDialogOpen && !isFormSubmit) {
            toggleDialogOpen(false)
        }
    }

    return (
        <>
            <div className="flex flex-row">
                <form className="flex flex-[4] flex-col h-full w-full space-y-6 pt-4">
                    <InputField
                        type="text"
                        id="username"
                        label="Username"
                        placeholder="eg. John Doe"
                        value={formValues.username}
                        onChange={handleUsernameChange}
                        error={formErrors.username}
                    />

                    <OptionsField
                        id="proficiency"
                        label="Proficiency"
                        value={formValues.proficiency.toString().toLowerCase()}
                        onChange={handleProficiencyChange}
                        error={formErrors.proficiency}
                    />

                    <CustomDialogWithButton
                        dialogOpen={isDialogOpen}
                        onDialogOpenChange={manageDialog} // Allow toggling the dialog
                        text="Update Profile"
                        className="w-fit bg-btn text-white text-sm py-2 px-4 rounded-md"
                        type="button"
                        variant="primary"
                        description="Are you sure you want to update your profile?"
                        onClickTrigger={handleUpdateClick} // Trigger validation and open dialog
                        onClickConfirm={handleFormSubmit} // Confirm action
                    />
                </form>
                <div className="flex flex-[2]"></div>
            </div>
        </>
    )
}

export default Profile
