import CustomLabel from '../ui/label'
import { Difficulty } from '@/types/difficulty'

import { FC } from 'react'

interface DifficultyLabelProps {
    complexity: Difficulty
}

export const DifficultyLabel: FC<DifficultyLabelProps> = ({ complexity }) => {
    let textColor = ''
    let bgColor = ''
    switch (complexity.toLowerCase()) {
        case Difficulty.Easy:
            textColor = 'text-green'
            bgColor = 'bg-green-light'
            break
        case Difficulty.Medium:
            textColor = 'text-amber'
            bgColor = 'bg-amber-light'
            break
        case Difficulty.Hard:
            textColor = 'text-red'
            bgColor = 'bg-red-light'
            break
        default:
            textColor = 'text-theme'
            bgColor = 'bg-theme-100'
    }

    return <CustomLabel title={complexity} textColor={textColor} bgColor={bgColor} />
}
