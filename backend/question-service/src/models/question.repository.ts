import { IQuestionCountsDto } from '@repo/question-types'
import { Category, SortedComplexity } from '@repo/user-types'
import { FilterQuery, Model, model, SortOrder } from 'mongoose'
import { CreateQuestionDto } from '../types/CreateQuestionDto'
import { IQuestion } from '../types/IQuestion'
import { QuestionDto } from '../types/QuestionDto'
import questionSchema from './question.model'

const questionModel: Model<IQuestion> = model('Question', questionSchema)

export async function findAllQuestions(): Promise<IQuestion[]> {
    return questionModel.find()
}

export async function findOneQuestionById(id: string): Promise<IQuestion | null> {
    return questionModel.findById(id)
}

export async function findOneQuestionByTitle(title: string): Promise<IQuestion | null> {
    return questionModel.findOne({ title })
}

export async function findRandomQuestionByTopicAndComplexity(
    category: Category,
    complexity: SortedComplexity
): Promise<QuestionDto | null> {
    const query = [
        {
            $match: {
                categories: { $in: [category] },
                complexity: complexity,
            },
        },
        {
            $sample: { size: 1 },
        },
    ]
    const result = await questionModel.aggregate(query)

    if (result.length === 0) {
        return null
    }
    return result[0]
}

export async function findPaginatedQuestionsWithSortAndFilter(
    start: number,
    limit: number,
    sortBy: string[][],
    filterBy: string[][]
): Promise<IQuestion[]> {
    return questionModel
        .find({
            $and: getFilterQueryOptions(filterBy),
        })
        .sort(sortBy.map(([key, order]): [string, SortOrder] => [key, order as SortOrder]))
        .limit(limit)
        .skip(start)
}

export async function findPaginatedQuestionsWithSort(
    start: number,
    limit: number,
    sortBy: string[][]
): Promise<IQuestion[]> {
    return questionModel
        .find()
        .sort(sortBy.map(([key, order]): [string, SortOrder] => [key, order as SortOrder]))
        .limit(limit)
        .skip(start)
}

export async function findPaginatedQuestionsWithFilter(
    start: number,
    limit: number,
    filterBy: string[][]
): Promise<IQuestion[]> {
    return questionModel
        .find({
            $and: getFilterQueryOptions(filterBy),
        })
        .limit(limit)
        .skip(start)
}

export async function findPaginatedQuestions(start: number, limit: number): Promise<IQuestion[]> {
    return questionModel.find().limit(limit).skip(start)
}

export async function findQuestionCountWithFilter(filterBy: string[][]): Promise<number> {
    return questionModel.countDocuments({
        $and: getFilterQueryOptions(filterBy),
    })
}

export async function findQuestionCount(): Promise<number> {
    return questionModel.countDocuments()
}

export async function findQuestionCountsByComplexity(): Promise<IQuestionCountsDto> {
    const query = [
        {
            $group: {
                _id: '$complexity',
                count: { $sum: 1 },
            },
        },
    ]
    const result = await questionModel.aggregate(query)

    const counts: IQuestionCountsDto = { easy: 0, medium: 0, hard: 0 }
    for (const { _id, count } of result) {
        switch (_id) {
            case '1EASY':
                counts.easy = count
                break
            case '2MEDIUM':
                counts.medium = count
                break
            case '3HARD':
                counts.hard = count
                break
        }
    }
    return counts
}

export async function createQuestion(dto: CreateQuestionDto): Promise<IQuestion> {
    return questionModel.create(dto)
}

export async function updateQuestion(id: string, dto: CreateQuestionDto): Promise<IQuestion | null> {
    return questionModel.findByIdAndUpdate(id, dto, { new: true })
}

export async function deleteQuestion(id: string): Promise<void> {
    await questionModel.findByIdAndDelete(id)
}

function getFilterQueryOptions(filterBy: string[][]): FilterQuery<IQuestion>[] {
    return filterBy.map(([key, value]) => {
        const query: { [key: string]: string | object } = {}
        if (isValidTextSearchFilter(key)) {
            query[key] = { $regex: value, $options: 'i' }
        } else {
            query[key] = value
        }
        return query
    })
}

export function getFilterKeys(): { keys: string[] } {
    return { keys: ['title', 'categories'] }
}

export function getSortKeysAndOrders(): { keys: string[]; orders: string[] } {
    return { keys: ['complexity'], orders: ['asc', 'desc'] }
}

export function getSearchKeys(): { keys: string[] } {
    return { keys: ['title'] }
}

export function isValidTextSearchFilter(key: string): boolean {
    const { keys } = getSearchKeys()
    return keys.includes(key)
}

export function isValidFilter(key: string): boolean {
    const { keys } = getFilterKeys()
    return keys.includes(key)
}

export function isValidSort(key: string, order: string): boolean {
    const { keys, orders } = getSortKeysAndOrders()
    return orders.includes(order) && keys.includes(key)
}
