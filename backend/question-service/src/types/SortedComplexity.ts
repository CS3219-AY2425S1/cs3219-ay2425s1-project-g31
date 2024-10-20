import { Complexity } from './Complexity'

export class SortedComplexity {
    public sortedEnum: string

    constructor(complexity: Complexity) {
        switch (complexity) {
            case Complexity.EASY:
                this.sortedEnum = `1${complexity}`
                break
            case Complexity.MEDIUM:
                this.sortedEnum = `2${complexity}`
                break
            case Complexity.HARD:
                this.sortedEnum = `3${complexity}`
                break
            default:
                throw new Error('Invalid complexity')
        }
    }
}
