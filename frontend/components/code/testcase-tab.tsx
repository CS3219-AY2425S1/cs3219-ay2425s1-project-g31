import CustomTabs from '@/components/customs/custom-tabs'
import { LargeTextSkeleton } from '../customs/custom-loader'

export default function TestcasesTab({
    isLoading,
    activeTestcaseIdx,
    setActiveTestcaseIdx,
    testInputs,
    testOutputs,
}: {
    isLoading: boolean
    activeTestcaseIdx: number
    setActiveTestcaseIdx: (tab: number) => void
    testInputs: string[]
    testOutputs: string[]
}) {
    const testcaseTabs = testInputs?.map((_, idx) => `Case ${idx + 1}`)

    if (isLoading) return <LargeTextSkeleton />

    if (!testInputs || testInputs.length === 0) return null
    return (
        <div className="w-full">
            <CustomTabs
                tabs={testcaseTabs}
                type="label"
                activeTab={activeTestcaseIdx}
                setActiveTab={setActiveTestcaseIdx}
            />
            <div className="flex flex-col gap-2 text-sm w-full">
                <span className="mt-2">Input = </span>
                <span className="px-2 py-1 rounded-lg bg-slate-100 w-full">{testInputs[activeTestcaseIdx]}</span>
                <span className="mt-2">Expected output = </span>
                <span className="px-2 py-1 rounded-lg bg-slate-100 w-full">{testOutputs[activeTestcaseIdx]}</span>
            </div>
        </div>
    )
}
