import validateInput, { initialFormValues } from '@/util/input-validation'

import CustomDialogWithButton from '../customs/custom-dialog'
import { InputField } from '../customs/custom-input'
import { toast } from 'sonner'
import usePasswordToggle from '../../hooks/UsePasswordToggle'
import { useState } from 'react'

function Setting() {
    const defaultEmail = sessionStorage.getItem('email')
    const [passwordInputType, passwordToggleIcon] = usePasswordToggle()
    const [confirmPasswordInputType, confirmPasswordToggleIcon] = usePasswordToggle()

    const [formValues, setFormValues] = useState({ ...initialFormValues, email: defaultEmail })
    const [formErrors, setFormErrors] = useState({ ...initialFormValues })
    const [isDeleteDialogOpen, toggleDeleteDialogOpen] = useState(false)
    const [isUpdateDialogOpen, toggleUpdateDialogOpen] = useState(false)
    const [isFormSubmit, setIsFormSubmit] = useState(false)

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { id, value } = e.target
        setFormValues({ ...formValues, [id]: value })
    }

    // Submit handler
    const handleFormSubmit = () => {
        setIsFormSubmit(true)
        toggleUpdateDialogOpen(false)
        toast.success('Profile has been updated successfully.')
        setFormValues({ ...initialFormValues, email: defaultEmail })
    }

    const handleUpdateClick = (): void => {
        const isTest = {
            username: false,
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
            toggleUpdateDialogOpen(true)
        }
    }

    const manageUpdateDialog = (): void => {
        if (isUpdateDialogOpen && !isFormSubmit) {
            toggleUpdateDialogOpen(false)
        }
    }

    const handleDeleteConfirm = (): void => {
        // Delete user from database
        toggleDeleteDialogOpen(false)
    }

    return (
        <>
            <div className="flex flex-col h-full">
                <div className="flex flex-[4] flex-row">
                    <form className="flex flex-[4] flex-col w-full space-y-6 pt-4 justify-start">
                        <InputField
                            id="email"
                            label="Email"
                            type="text"
                            placeholder="name@example.com"
                            value={formValues.email}
                            onChange={handleFormChange}
                            error={formErrors.email}
                        />

                        <InputField
                            id="password"
                            label="Password"
                            type={passwordInputType}
                            placeholder="Enter Password"
                            icon={passwordToggleIcon}
                            value={formValues.password}
                            onChange={handleFormChange}
                            error={formErrors.password}
                        />

                        <InputField
                            id="confirmPassword"
                            label="Confirm Password"
                            type={confirmPasswordInputType}
                            placeholder="Enter Password"
                            icon={confirmPasswordToggleIcon}
                            value={formValues.confirmPassword}
                            onChange={handleFormChange}
                            error={formErrors.confirmPassword}
                        />

                        <CustomDialogWithButton
                            dialogOpen={isUpdateDialogOpen}
                            onDialogOpenChange={manageUpdateDialog}
                            text="Update Settings"
                            className="w-fit bg-btn text-white text-sm py-2 px-4 rounded-md hover:bg-theme-700"
                            type="button"
                            variant="primary"
                            description="Are you sure you want to update your settings?"
                            onClickTrigger={handleUpdateClick}
                            onClickConfirm={handleFormSubmit}
                        />
                    </form>
                    <div className="flex flex-[2]"></div>
                </div>
                <div className="flex flex-[1] mr-6 relative flex-col justify-evenly">
                    <span className="absolute block transform -translate-x-1/2 left-1/2 top-0 h-0.5 w-screen bg-slate-200"></span>
                    <p className="pt-4">Would you like to delete your account and all associated data?</p>
                    <CustomDialogWithButton
                        dialogOpen={isDeleteDialogOpen}
                        onDialogOpenChange={toggleDeleteDialogOpen}
                        text="Delete Account"
                        className="w-fit text-red-delete text-sm"
                        type="submit"
                        variant="outline"
                        description="Are you sure you want to delete your account? You will not be able to recover your data."
                        onClickConfirm={handleDeleteConfirm}
                    />
                </div>
            </div>
        </>
    )
}

export default Setting
