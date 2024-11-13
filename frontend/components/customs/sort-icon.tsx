import { SortDirection } from '@/types'
import { TriangleDownIcon, TriangleUpIcon } from '@radix-ui/react-icons'

export default function SortIcon({ sortDir }: { sortDir: SortDirection }) {
    return (
        <div>
            <TriangleUpIcon
                className={`h-4 w-4 -mb-2 ${sortDir === SortDirection.ASC ? 'text-black' : 'text-gray-400'} `}
            />
            <TriangleDownIcon
                className={`h-4 -mt-2 w-4" ${sortDir === SortDirection.DESC ? 'text-black' : 'text-gray-400'} `}
            />
        </div>
    )
}
