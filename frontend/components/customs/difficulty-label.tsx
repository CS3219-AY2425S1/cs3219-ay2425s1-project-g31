import CustomLabel from '../ui/label'
import { Complexity } from '@repo/user-types'

import { FC } from 'react'

interface DifficultyLabelProps {
    complexity: Complexity
}

export const DifficultyLabel: FC<DifficultyLabelProps> = ({ complexity }) => {
    let textColor = ''
    let bgColor = ''
    switch (complexity) {
        case Complexity.EASY:
            textColor = 'text-green'
            bgColor = 'bg-green-light'
            break
        case Complexity.MEDIUM:
            textColor = 'text-amber'
            bgColor = 'bg-amber-light'
            break
        case Complexity.HARD:
            textColor = 'text-red'
            bgColor = 'bg-red-light'
            break
        default:
            textColor = 'text-theme'
            bgColor = 'bg-theme-100'
    }

    return <CustomLabel title={complexity} textColor={textColor} bgColor={bgColor} />
}
