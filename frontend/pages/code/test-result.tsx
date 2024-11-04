import { IResponse } from '@repo/submission-types'

export default function TestResult({ result, expectedOutput }: { result?: IResponse; expectedOutput: string }) {
    if (!result) return <div className="text-sm text-slate-400">No test results yet</div>

    return (
        <div>
            <div>
                {result.status?.id === 3 ? (
                    <span className="text-lg font-semibold text-green-500">Accepted</span>
                ) : (
                    <span className="text-lg font-semibold text-red-500">Wrong Answer</span>
                )}
                <p className="text-sm text-gray-600 mt-1">Runtime: {result.time} ms</p>
            </div>
            <div className="flex flex-col gap-2 text-sm">
                <span className="mt-2">Your Output = </span>
                <span className="px-2 py-1 rounded-lg bg-slate-100">{result.stdout ?? 'N/A'}</span>
                <span className="mt-2">Expected output = </span>
                <span className="px-2 py-1 rounded-lg bg-slate-100">{expectedOutput}</span>
            </div>
        </div>
    )
}
