import { IResponse } from '@repo/submission-types'

export default function TestResult({ result, expectedOutput }: { result?: IResponse; expectedOutput: string }) {
    if (!result) return <div className="text-sm text-slate-400">No test results yet</div>

    if (!result.status) {
        return (
            <div className="space-y-2">
                <p className="text-lg font-semibold text-red-500">Unexpected server error</p>
                <p className="text-sm">We are very sorry. Please try again later</p>
            </div>
        )
    }

    const { id, description } = result.status

    return (
        <div className="w-full">
            <div className="w-full">
                {id === 3 ? (
                    <span className="text-lg font-semibold text-green-500">{description}</span>
                ) : (
                    <span className="text-lg font-semibold text-red-500">{description}</span>
                )}
                <p className="text-sm text-gray-600 mt-1">Runtime: {result.time || '-'} ms</p>
            </div>
            {id === 6 && result.compile_output && (
                <div className="mt-2 w-full">
                    <span className="text-sm font-semibold text-red-500">Error</span>
                    <p className="px-2 py-1 text-sm text-gray-600 mt-1 whitespace-pre-wrap rounded-lg bg-slate-100 w-full">
                        {result.compile_output}
                    </p>
                </div>
            )}
            {result.stderr && (
                <div className="mt-2 w-full">
                    <span className="text-sm font-semibold text-red-500">Error</span>
                    <p className="px-2 py-1 text-sm text-gray-600 mt-1 whitespace-pre-wrap rounded-lg bg-slate-100 w-full">
                        {result.stderr}
                    </p>
                </div>
            )}
            {(id === 3 || id == 4) && (
                <div className="flex flex-col gap-2 text-sm">
                    <span className="mt-2">Your Output = </span>
                    <span className="px-2 py-1 rounded-lg bg-slate-100 whitespace-pre-wrap">
                        {result.stdout ?? 'N/A'}
                    </span>
                    <span className="mt-2">Expected Output = </span>
                    <span className="px-2 py-1 rounded-lg bg-slate-100 whitespace-pre-wrap">{expectedOutput}</span>
                </div>
            )}
        </div>
    )
}
