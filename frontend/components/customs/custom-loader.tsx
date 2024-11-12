import { Skeleton } from '@/components/ui/skeleton'

function TableSkeleton() {
    return (
        <div className="flex flex-col">
            <Skeleton className="h-10 w-1/5 my-2" />
            <Skeleton className="h-40 w-full my-2" />
        </div>
    )
}

function TextSkeleton() {
    return <Skeleton className="inline-block align-baseline h-6 w-40" />
}

function LargeTextSkeleton() {
    return <Skeleton className="inline-block align-baseline h-40 w-full" />
}

function LongTextSkeleton() {
    return <Skeleton className="inline-block align-baseline h-6 w-full" />
}

function DataSkeleton() {
    return (
        <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    )
}

export { TableSkeleton, DataSkeleton, TextSkeleton, LargeTextSkeleton, LongTextSkeleton }
