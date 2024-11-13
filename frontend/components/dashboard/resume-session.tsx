import { useRouter } from 'next/router'
import { Button } from '../ui/button'
import { IMatch } from '@repo/user-types'
import { convertSortedComplexityToComplexity } from '@repo/question-types'
import { capitalizeFirstLowerRest } from '@/util/string-modification'
import { encodeStr } from '@/util/encryption'
import { toast } from 'sonner'

interface IResumeSessionProps {
    match: IMatch
    isOngoing: () => Promise<boolean>
}

export default function ResumeSession({ match, isOngoing }: IResumeSessionProps) {
    const router = useRouter()

    const { category, complexity } = match

    const handleResume = async () => {
        try {
            const ongoing = await isOngoing()
            if (!ongoing) return
            const encodedId = encodeStr(match.id)
            router.push(`/code/${encodedId}`)
        } catch (error) {
            toast.error('Unable to resume session due to a server error')
        }
    }

    return (
        <div className="border-solid border-2 border-gray-200 rounded flex flex-col w-dashboard p-6 min-h-[60vh] max-h-[90vh] overflow-auto justify-between">
            <div className="space-y-6">
                <h3 className="text-xl font-bold">Resume Session</h3>
                <p>You have an ongoing session for:</p>
                <form>
                    <label htmlFor="topic" className="block font-bold mb-2">
                        Category
                    </label>
                    <input
                        id="ongoing-topic"
                        type="text"
                        value={capitalizeFirstLowerRest(category)}
                        readOnly
                        className="w-full p-2 text-sm border-solid border-2 border-gray-200 rounded bg-gray-50"
                    />
                    <label htmlFor="complexity" className="block font-bold mb-2 mt-5">
                        Complexity
                    </label>
                    <input
                        id="ongoing-complexity"
                        type="text"
                        value={capitalizeFirstLowerRest(convertSortedComplexityToComplexity(complexity))}
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
