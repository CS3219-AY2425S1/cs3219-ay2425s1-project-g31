import { TickIcon, ExclamationIcon } from '@/assets/icons'
import { DifficultyLabel } from '@/components/customs/difficulty-label'
import { Difficulty, FormType, IDatatableColumn, IFormFields, QuestionStatus } from '@/types'
import { Category } from '@repo/user-types'

const columns: IDatatableColumn[] = [
    {
        key: 'id',
        isHidden: true,
    },
    {
        key: 'title',
        width: '20%',
        offAutoCapitalize: true,
    },
    {
        key: 'categories',
    },
    {
        key: 'description',
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
        isSortable: true,
        formatter: (value) => {
            return <DifficultyLabel complexity={value} />
        },
    },
    {
        key: 'actions',
        isEdit: true,
        isDelete: true,
        width: '12%',
    },
]

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
        selectOptions: Object.values(Difficulty),
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
]

export { columns, formFields }

export default function None() {
    return null
}
