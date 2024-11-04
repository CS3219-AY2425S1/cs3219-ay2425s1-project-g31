import CustomTabs from '@/components/customs/custom-tabs'

export default function TestcasesTab({
    activeTestcaseIdx,
    setActiveTestcaseIdx,
    testInputs,
    testOutputs,
}: {
    activeTestcaseIdx: number
    setActiveTestcaseIdx: (tab: number) => void
    testInputs: string[]
    testOutputs: string[]
}) {
    const testcaseTabs = testInputs?.map((_, idx) => `Case ${idx + 1}`)

    if (testInputs.length === 0) return null
    return (
        <div>
            <CustomTabs
                tabs={testcaseTabs}
                type="label"
                activeTab={activeTestcaseIdx}
                setActiveTab={setActiveTestcaseIdx}
            />
            <div className="flex flex-col gap-2 text-sm">
                <span className="mt-2">Input = </span>
                <span className="px-2 py-1 rounded-lg bg-slate-100">{testInputs[activeTestcaseIdx]}</span>
                <span className="mt-2">Expected output = </span>
                <span className="px-2 py-1 rounded-lg bg-slate-100">{testOutputs[activeTestcaseIdx]}</span>
            </div>
        </div>
    )
}
