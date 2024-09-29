import { InputField, OptionsField } from '../customs/custom-input'
import validateInput, { initialFormValues } from '@/util/input-validation'

import CustomDialogWithButton from '../customs/custom-dialog'
import { toast } from 'sonner'
import { useMemo, useState } from 'react'

function Profile() {
    const defaultUsername: string = useMemo(() => {
        if (typeof window !== 'undefined') {
            return sessionStorage.getItem('username') ?? ''
        }
        return ''
    }, [])
    const [formValues, setFormValues] = useState({ ...initialFormValues, username: defaultUsername })
    const [formErrors, setFormErrors] = useState({ ...initialFormValues })
    const [isDialogOpen, toggleDialogOpen] = useState(false)
    const [isFormSubmit, setIsFormSubmit] = useState(false)

    const handleUsernameChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>): void => {
        const { id, value } = e.target
        setFormValues({ ...formValues, [id]: value })
    }

    const handleProficiencyChange = (e: string): void => {
        setFormValues({ ...formValues, proficiency: e })
    }

    const handleFormSubmit = (): void => {
        setIsFormSubmit(true)
        toggleDialogOpen(false)
        toast.success('Profile has been updated successfully.')
        setFormValues({ ...initialFormValues, username: defaultUsername })
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
                        value={formValues.proficiency}
                        onChange={handleProficiencyChange}
                        error={formErrors.proficiency}
                    />

                    <CustomDialogWithButton
                        dialogOpen={isDialogOpen}
                        onDialogOpenChange={manageDialog} // Allow toggling the dialog
                        text="Update Profile"
                        className="w-fit bg-btn text-white text-sm py-2 px-4 rounded-md hover:bg-purple-700"
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
