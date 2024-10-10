import CustomTabs from '@/components/customs/custom-tabs'
import { ITestcase } from '@/types'
import { useState } from 'react'

export default function TestcasesTab({ testcases }: { testcases: ITestcase[] }) {
    const [activeTestcaseIdx, setActiveTestcaseIdx] = useState(0)
    const testcaseTabs = testcases?.map((testcase) => `Case ${testcase.idx}`)

    if (!testcases) return null
    return (
        <div>
            <CustomTabs
                tabs={testcaseTabs}
                handleActiveTabChange={(tab) => setActiveTestcaseIdx(tab)}
                type="label"
                size="label"
            />
            <div className="flex flex-col gap-2 text-sm">
                <span className="mt-2">{testcases[activeTestcaseIdx]?.inputVar} =</span>
                <span className="px-2 py-1 rounded-lg bg-slate-100">{testcases[activeTestcaseIdx]?.input}</span>
                <span className="mt-2">Expected output = </span>
                <span className="px-2 py-1 rounded-lg bg-slate-100">
                    {testcases[activeTestcaseIdx]?.expectedOutput}
                </span>
            </div>
        </div>
    )
}
