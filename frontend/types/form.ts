enum FormType {
    TEXT = 'text',
    TEXTAREA = 'textarea',
    SELECT = 'select',
    MULTISELECT = 'multiselect',
    HIDDEN = 'hidden',
}

interface IFormFields {
    label: string
    accessKey: string
    formType: FormType
    placeholder?: string
    required?: boolean
    selectOptions?: string[]
}

export { FormType }
export type { IFormFields }
