import * as React from 'react'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'

interface ISelectProps {
    options: string[] | number[]
    defaultValue?: string | number
    onSelectChange: (value: string) => void
    className?: string
}

const CustomSelect = ({ options, defaultValue, onSelectChange, className }: ISelectProps) => {
    const [displayValue, setDisplayValue] = React.useState(defaultValue || options[0])
    const selectOptions = options.map((option) => option.toString())
    const selectDefault = defaultValue ? defaultValue.toString() : selectOptions[0]

    const handleValueChange = (val: string) => {
        setDisplayValue(val)
        onSelectChange(val)
    }

    return (
        <div className={className}>
            <Select defaultValue={selectDefault} value={displayValue.toString()} onValueChange={handleValueChange}>
                <SelectTrigger className="hover:border-gray-400">
                    <SelectValue>
                        <div className="flex items-center gap-2 uppercase">{displayValue}</div>
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {selectOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                            <span className="uppercase">{option}</span>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export default CustomSelect
