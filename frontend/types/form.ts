enum FormType {
    TEXT = 'text',
    TEXTAREA = 'textarea',
    SELECT = 'select',
    MULTISELECT = 'multiselect',
    HIDDEN = 'hidden',
    CUSTOM_TESTCASE = 'custom_testcase',
}

interface IFormFields {
    label: string
    accessKey: string
    formType: FormType
    placeholder?: string
    required?: boolean
    selectOptions?: string[]
    customValidator?: (data: any) => boolean // Return true if data is valid
}

export { FormType }
export type { IFormFields }
