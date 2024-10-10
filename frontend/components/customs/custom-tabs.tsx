import { useState } from 'react'
import { Button, ButtonProps } from '../ui/button'

interface CustomTabsProps {
    tabs: string[]
    isBottomBorder?: boolean
    type?: 'default' | 'label'
    size?: ButtonProps['size']
    handleActiveTabChange: (idx: number) => void
    className?: string
    btnclassName?: string
}

export default function CustomTabs({
    tabs,
    handleActiveTabChange,
    isBottomBorder,
    type,
    size,
    className,
    btnclassName,
}: CustomTabsProps) {
    const [activeTab, setActiveTab] = useState(0)

    const tabVariant = (idx: number) => {
        if (activeTab === idx) {
            return type === 'label' ? 'activeTabLabel' : 'activeTab'
        }
        return type === 'label' ? 'ghostTabLabel' : 'ghostTab'
    }

    const handleSetActiveTab = (idx: number) => {
        setActiveTab(idx)
        handleActiveTabChange(idx)
    }

    return (
        <div
            id="test-tabs"
            className={`${isBottomBorder ? 'border-b-2 border-slate-100' : ''} flex items-center ${type === 'label' ? 'gap-2' : ''} ${className}`}
        >
            {tabs.map((tab, index) => (
                <Button
                    key={index}
                    variant={tabVariant(index)}
                    size={size || 'default'}
                    onClick={() => handleSetActiveTab(index)}
                    className={`${isBottomBorder ? '-mb-[0.1rem]' : ''} ${btnclassName}`}
                >
                    {tab}
                </Button>
            ))}
        </div>
    )
}
