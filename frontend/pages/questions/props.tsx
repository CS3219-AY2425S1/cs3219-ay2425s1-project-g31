import { FormType, IDatatableColumn, IFormFields, QuestionStatus } from '@/types'
import { ExclamationIcon, TickIcon } from '@/assets/icons'

import { Category, Complexity } from '@repo/user-types'
import CustomLabel from '@/components/ui/label'
import { DifficultyLabel } from '@/components/customs/difficulty-label'
import { ITestcase } from '@/types/question'
import { capitalizeFirstLowerRest } from '@/util/string-modification'

const getColumns = (isAdmin: boolean): IDatatableColumn[] => {
    return [
        {
            key: 'id',
            isHidden: true,
        },
        {
            key: 'title',
            width: '30%',
            offAutoCapitalize: true,
        },
        {
            key: 'categories',
            width: '40%',
            formatter: (values) => {
                const c = values.map((v: string) => (
                    <CustomLabel
                        key={v}
                        title={capitalizeFirstLowerRest(v)}
                        textColor="text-theme"
                        bgColor="bg-theme-100"
                        margin="1"
                    />
                ))
                return <div className="flex flex-wrap items-center justify-center gap-3">{c}</div>
            },
        },
        {
            key: 'description',
            isHidden: true,
            width: '35%',
            offAutoCapitalize: true,
            formatter: (value) => {
                return (
                    <div
                        style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                        }}
                    >
                        {value}
                    </div>
                )
            },
        },
        {
            key: 'status',
            isHidden: true,
            formatter: (value) => {
                return (
                    <div className="flex items-center justify-center">
                        {value === QuestionStatus.COMPLETED ? (
                            <TickIcon />
                        ) : value === QuestionStatus.FAILED ? (
                            <ExclamationIcon />
                        ) : null}
                    </div>
                )
            },
        },
        {
            key: 'complexity',
            width: '10%',
            isSortable: true,
            formatter: (value) => {
                return <DifficultyLabel complexity={value} />
            },
        },
        {
            isHidden: !isAdmin,
            key: 'actions',
            isEdit: true,
            isDelete: true,
            width: '12%',
        },
    ]
}

const formFields: IFormFields[] = [
    {
        label: 'Title',
        accessKey: 'title',
        formType: FormType.TEXT,
        placeholder: 'Enter title',
        required: true,
    },
    {
        label: 'Categories',
        accessKey: 'categories',
        formType: FormType.MULTISELECT,
        required: true,
        selectOptions: Object.values(Category), // Todo: retrieve set from BE
    },
    {
        label: 'Complexity',
        accessKey: 'complexity',
        formType: FormType.SELECT,
        required: true,
        selectOptions: Object.values(Complexity),
    },
    {
        label: 'Description',
        accessKey: 'description',
        formType: FormType.TEXTAREA,
        placeholder: 'Enter description',
        required: true,
    },
    {
        label: 'Link',
        accessKey: 'link',
        formType: FormType.TEXT,
        placeholder: 'Enter link',
        required: true,
    },
    {
        label: 'Testcases',
        accessKey: 'testCases',
        formType: FormType.CUSTOM_TESTCASE,
        placeholder: 'Enter testcases',
        required: true,
        customValidator: (data: ITestcase[]) => {
            return data.length > 0 && data.every((t) => t.input?.trim() !== '' && t.output?.trim() !== '')
        },
    },
]

export { getColumns, formFields }

export default function None() {
    return null
}
