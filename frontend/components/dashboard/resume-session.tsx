import { useRouter } from 'next/router'
import { Button } from '../ui/button'
import { IMatch } from '@repo/user-types'
import { convertSortedComplexityToComplexity } from '@repo/question-types'

export default function ResumeSession({ match }: { match: IMatch }) {
    const router = useRouter()
    const handleResume = async () => {
        router.push(`/code/${match.id}`)
    }
    const { category, complexity } = match
    return (
        <div className="border-solid border-2 border-gray-200 rounded flex flex-col w-dashboard p-6 min-h-[60vh] max-h-[90vh] overflow-auto justify-between">
            <div className="space-y-6">
                <h3 className="text-xl font-bold">Resume Session</h3>
                <p>You have an ongoing session for:</p>
                <form>
                    <label htmlFor="topic" className="block font-bold mb-2">
                        Topic
                    </label>
                    <input
                        id="ongoing-topic"
                        type="text"
                        value={category}
                        readOnly
                        className="w-full p-2 text-sm border-solid border-2 border-gray-200 rounded bg-gray-50"
                    />
                    <label htmlFor="complexity" className="block font-bold mb-2 mt-5">
                        Complexity
                    </label>
                    <input
                        id="ongoing-complexity"
                        type="text"
                        value={convertSortedComplexityToComplexity(complexity)}
                        readOnly
                        className="w-full p-2 text-sm border-solid border-2 border-gray-200 rounded bg-gray-50"
                    />
                </form>
            </div>
            <Button variant="primary" className="w-full mt-4" onClick={handleResume}>
                Resume
            </Button>
        </div>
    )
}
