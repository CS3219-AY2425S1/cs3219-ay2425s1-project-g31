import { Complexity, SortedComplexity } from '@repo/user-types'

export function convertComplexityToSortedComplexity(complexity: Complexity): SortedComplexity {
    switch (complexity) {
        case Complexity.EASY:
            return SortedComplexity.EASY
        case Complexity.MEDIUM:
            return SortedComplexity.MEDIUM
        case Complexity.HARD:
            return SortedComplexity.HARD
        default:
            throw new Error('Invalid complexity')
    }
}

export function convertSortedComplexityToComplexity(sortedComplexity: SortedComplexity | Complexity): Complexity {
    switch (sortedComplexity) {
        case SortedComplexity.EASY:
            return Complexity.EASY
        case SortedComplexity.MEDIUM:
            return Complexity.MEDIUM
        case SortedComplexity.HARD:
            return Complexity.HARD
        default:
            throw new Error('Invalid sorted complexity')
    }
}
