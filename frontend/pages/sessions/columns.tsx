import { TickIcon, ExclamationIcon, PlayIcon } from '@/assets/icons'
import { DifficultyLabel } from '@/components/customs/difficulty-label'
import { Button } from '@/components/ui/button'
import CustomLabel from '@/components/ui/label'
import { IDatatableColumn, IRowData } from '@/types'
import { encodeStr } from '@/util/encryption'
import { capitalizeFirstLowerRest } from '@/util/string-modification'
import { EyeIcon } from 'lucide-react'
import { NextRouter } from 'next/router'

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
        label: 'Collaborator',
        offAutoCapitalize: true,
    },
    {
        key: 'question',
        offAutoCapitalize: true,
    },
    {
        key: 'category',
        formatter: (value) => {
            return (
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <CustomLabel
                        title={capitalizeFirstLowerRest(value)}
                        textColor="text-theme"
                        bgColor="bg-theme-100"
                        margin="1"
                    />
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
    {
        key: 'actions',
        label: 'Actions',
        customAction: {
            formatter: (elem: IRowData, router: NextRouter) => {
                return (
                    <div className="flex items-center justify-center gap-3">
                        <Button
                            variant="iconNoBorder"
                            size="icon"
                            onClick={() => {
                                const encoded = encodeStr(elem._id)
                                router.push(`/code/${encoded}`)
                            }}
                        >
                            {elem.isCompleted ? <EyeIcon /> : <PlayIcon />}
                        </Button>
                    </div>
                )
            },
        },
    },
]

export default function None() {
    return null
}
