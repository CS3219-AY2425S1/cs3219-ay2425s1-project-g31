import React from 'react'

import Select, { MultiValue, StylesConfig } from 'react-select'

interface ISelectProps {
    options: string[]
    defaultValues?: string[]
    onSelectChange: (values: string[]) => void
    className?: string
}

export default function Multiselect({ options, defaultValues, onSelectChange }: ISelectProps) {
    const formattedOptions = options.map((option) => ({ value: option, label: option }))
    const formattedDefaultValues = defaultValues ? defaultValues.map((value) => ({ value, label: value })) : []

    const handleSelectChange = (selectedOptions: MultiValue<{ label: string; value: string }>) => {
        const formatted = selectedOptions.map((opt) => opt.value)
        onSelectChange(formatted)
    }

    const customStyles: StylesConfig<{ value: string; label: string }> = {
        control: (provided) => ({
            ...provided,
            backgroundColor: 'white', // Example: control background color
            border: '1px solid hsl(var(--input))',
            borderRadius: 'calc(var(--radius) - 2px)',
            boxShadow: 'none',
            '&:hover': {
                borderColor: '#9ca3af',
            },
            fontSize: 14,
            color: 'hsl(var(--primary))',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? 'black' : 'white',
            '&:hover': {
                backgroundColor: 'hsl(var(--hover-fill))',
            },
            fontSize: 14,
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: 'hsl(var(--hover-fill))',
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: 'gray', // Remove button color
            ':hover': {
                backgroundColor: 'darkred',
                color: 'white',
            },
        }),
    }

    return (
        <Select
            defaultValue={formattedDefaultValues}
            isMulti
            name="colors"
            options={formattedOptions}
            className="basic-multi-select z-[1004]"
            classNamePrefix="select"
            onChange={handleSelectChange}
            styles={customStyles}
        />
    )
}
