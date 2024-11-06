import { TickIcon, ExclamationIcon } from '@/assets/icons'
import { DifficultyLabel } from '@/components/customs/difficulty-label'
import CustomLabel from '@/components/ui/label'
import { IDatatableColumn } from '@/types'

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
        key: 'category',
        formatter: (value) => {
            return (
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <CustomLabel title={value} textColor="text-theme" bgColor="bg-theme-100" margin="1" />
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
        key: 'createdAt',
        label: 'Datetime',
        formatter: (value) => {
            return <span>{convertTimestamp(value)}</span>
        },
        isSortable: true,
    },
    {
        key: 'isCompleted',
        label: 'Status',
        maxWidth: '5%',
        formatter: (value) => {
            return <div className="flex items-center justify-center">{value ? <TickIcon /> : <ExclamationIcon />}</div>
        },
    },
]

export default function None() {
    return null
}
