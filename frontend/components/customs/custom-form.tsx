import { FormType, IFormFields } from '@/types'
import CustomSelect from './custom-select'
import { Button } from '../ui/button'
import Multiselect from './multiple-select'
import { useState } from 'react'
import TestcaseForm from '@/pages/questions/testcase-form'

interface CustomFormProps {
    fields: IFormFields[]
    data: any
    submitHandler: (data: any) => void
}

export default function CustomForm({ fields, data, submitHandler }: CustomFormProps) {
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, accessKey: string) => {
        data[accessKey] = e.target.value
    }

    const handleSelectChange = (selectedValue: string, accessKey: string) => {
        data[accessKey] = selectedValue
    }

    const handleMultiSelectChange = (newValues: string[], accessKey: string) => {
        data[accessKey] = newValues
    }

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        const isFormValid = validateFields()
        if (!isFormValid) return
        submitHandler(data)
    }

    const isFieldEmpty = (accessKey: string) => {
        const value = data[accessKey]
        if (Array.isArray(value)) {
            return value.length <= 0
        }
        if (value == undefined || value === '') return true
    }

    const validateFields = () => {
        const newErrors: { [key: string]: string } = {}
        fields.forEach((field) => {
            if (field.required) {
                const isEmpty = field.customValidator
                    ? !field.customValidator(data[field.accessKey])
                    : isFieldEmpty(field.accessKey)
                if (isEmpty) {
                    newErrors[field.accessKey] = 'This field is required!'
                }
            }
        })
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0 // If no errors, return true
    }

    return (
        <form>
            {fields.map((field, index) => {
                if (data[field.accessKey] == undefined) {
                    return null
                }
                return (
                    <div key={index} className="flex flex-col gap-2 mb-5">
                        <span className="text-sm font-semibold">{field.label}</span>
                        {field.formType === FormType.TEXT && (
                            <input
                                type="text"
                                defaultValue={data[field.accessKey]}
                                onChange={(e) => handleDataChange(e, field.accessKey)}
                                className="w-full border border-input p-2 rounded-md text-sm hover:border-gray-400"
                            />
                        )}
                        {field.formType === FormType.TEXTAREA && (
                            <textarea
                                className="w-full border border-input p-2 rounded-md text-sm hover:border-gray-400"
                                defaultValue={data[field.accessKey]}
                                onChange={(e) => handleDataChange(e, field.accessKey)}
                            />
                        )}
                        {field.formType === FormType.SELECT && field.selectOptions && (
                            <CustomSelect
                                options={field.selectOptions}
                                onSelectChange={(val) => handleSelectChange(val, field.accessKey)}
                                defaultValue={data[field.accessKey]}
                                className="hover:border-gray-400"
                            />
                        )}
                        {field.formType === FormType.MULTISELECT && field.selectOptions && (
                            <Multiselect
                                options={field.selectOptions}
                                defaultValues={data[field.accessKey]}
                                onSelectChange={(vals) => handleMultiSelectChange(vals, field.accessKey)}
                            />
                        )}
                        {field.formType === FormType.CUSTOM_TESTCASE && (
                            <TestcaseForm
                                data={data[field.accessKey]}
                                onDataChange={(testcase) => {
                                    data[field.accessKey] = testcase
                                }}
                            />
                        )}
                        {errors[field.accessKey] && (
                            <span className="text-xs text-red-400">{errors[field.accessKey]}</span>
                        )}
                    </div>
                )
            })}
            <div className="w-full flex flex-row-reverse mt-10">
                <Button variant="primary" className="bottom-4" onClick={handleSubmit}>
                    Submit
                </Button>
            </div>
        </form>
    )
}
