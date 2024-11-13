import { DeleteIcon } from '@/assets/icons'
import { Button } from '@/components/ui/button'
import { ITestcase } from '@/types/question'
import { useState } from 'react'

interface ITestcaseFormProps {
    data: unknown
    onDataChange: (testcases: ITestcase[]) => void
}

export default function TestcaseForm({ data, onDataChange }: ITestcaseFormProps) {
    const [testcases, setTestcases] = useState<ITestcase[]>(data as ITestcase[])
    const [isShowError, setIsShowError] = useState(false)

    const addTestcase = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault()
        const isEmptyTestcase = testcases.some(
            (testcase) => testcase.input?.trim() === '' || testcase.output?.trim() === ''
        )
        if (isEmptyTestcase) {
            setIsShowError(true)
            return
        }
        setIsShowError(false)
        const newTestcases = [...testcases, { input: '', output: '' }]
        setTestcases(newTestcases)
        onDataChange(newTestcases)
    }

    const handleValueChange = (type: 'input' | 'output', value: string, index: number): void => {
        const newTestcases = [...testcases]
        newTestcases[index][type] = value
        setTestcases(newTestcases)
        onDataChange(newTestcases)
    }

    const handleDeleteTestcase = (index: number): void => {
        const newTestcases = testcases.filter((_, i) => i !== index)
        setTestcases(newTestcases)
        onDataChange(newTestcases)
    }

    return (
        <div className="w-full space-y-3">
            {testcases &&
                testcases.map((testcase, index) => (
                    <div className="flex gap-2" key={index}>
                        <input
                            type="text"
                            placeholder="Enter input"
                            className="w-full border border-input p-2 rounded-md text-sm hover:border-gray-400 mr-2"
                            value={testcase.input}
                            onChange={(e) => handleValueChange('input', e.target.value, index)}
                        />
                        <input
                            type="text"
                            placeholder="Enter output"
                            className="w-full border border-input p-2 rounded-md text-sm hover:border-gray-400"
                            value={testcase.output}
                            onChange={(e) => handleValueChange('output', e.target.value, index)}
                        />
                        <Button
                            variant="iconNoBorder"
                            className="px-2"
                            onClick={(e) => {
                                e.preventDefault()
                                handleDeleteTestcase(index)
                            }}
                        >
                            <DeleteIcon />
                        </Button>
                    </div>
                ))}
            {isShowError && <p className="text-red-400 text-xs mt-2">Please fill in all current testcases first!</p>}
            <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-400 px-3 py-2 rounded-md w-full text-sm"
                onClick={addTestcase}
            >
                + Add
            </button>
        </div>
    )
}
