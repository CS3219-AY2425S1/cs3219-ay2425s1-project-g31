import { TickIcon, ExclamationIcon } from '@/assets/icons'
import { DifficultyLabel } from '@/components/customs/difficulty-label'
import { IDatatableColumn, QuestionStatus } from '@/types'

const convertTimestamp = (millis: number) => {
    const date = new Date(millis)
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    })
}

export const columns: IDatatableColumn[] = [
    {
        key: 'collaboratorName',
        label: 'Name',
    },
    {
        key: 'question',
    },
    {
        key: 'isCompleted',
        label: 'Status',
        maxWidth: '5%',
        formatter: (value) => {
            return <div className="flex items-center justify-center">{value ? <TickIcon /> : <ExclamationIcon />}</div>
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
        key: 'createdAt',
        label: 'Time',
        formatter: (value) => {
            return <span>{convertTimestamp(value)}</span>
        },
        isSortable: true,
    },
]

export default function None() {
    return null
}
