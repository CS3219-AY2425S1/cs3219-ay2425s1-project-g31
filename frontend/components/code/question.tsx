import { LargeTextSkeleton, TextSkeleton } from '@/components/customs/custom-loader'
import { DifficultyLabel } from '@/components/customs/difficulty-label'
import CustomLabel from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { capitalizeFirstLowerRest } from '@/util/string-modification'
import { convertSortedComplexityToComplexity } from '@repo/question-types'
import { Category, Complexity } from '@repo/user-types'

const formatQuestionCategories = (cat: Category[]) => {
    return cat.map((c) => capitalizeFirstLowerRest(c)).join(', ')
}

export const CodeQuestion = ({
    loading,
    title,
    complexity,
    categories,
    description,
}: {
    loading: boolean
    title: string
    complexity: Complexity
    categories: Category[]
    description: string
}) => {
    if (loading) {
        return (
            <div id="question-data" className="flex-grow border-2 rounded-lg border-slate-100 mt-2 py-2 px-3">
                <h3 className="text-lg font-medium">
                    <TextSkeleton />
                </h3>
                <div className="flex gap-3 my-2 text-sm">
                    <TextSkeleton />
                    <TextSkeleton />
                </div>
                <div className="mt-6">
                    <LargeTextSkeleton />
                </div>
            </div>
        )
    }
    return (
        <ScrollArea
            id="question-data"
            className="flex-grow border-2 rounded-lg border-slate-100 mt-2 py-2 px-3 overflow-y-auto"
        >
            <h3 className="text-lg font-medium">{title}</h3>
            <div className="flex gap-3 my-2 text-sm">
                <DifficultyLabel complexity={convertSortedComplexityToComplexity(complexity)} />
                <CustomLabel
                    title={formatQuestionCategories(categories ?? [])}
                    textColor="text-theme"
                    bgColor="bg-theme-100"
                />
            </div>
            <div className="mt-6 whitespace-pre-wrap">{description}</div>
        </ScrollArea>
    )
}
