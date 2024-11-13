import { IPaginationRequest, ITypedBodyRequest } from '@repo/request-types'
import { Request, Response } from 'express'
import {
    createQuestion,
    deleteQuestion,
    findOneQuestionById,
    findOneQuestionByTitle,
    findPaginatedQuestions,
    findPaginatedQuestionsWithFilter,
    findPaginatedQuestionsWithSort,
    findPaginatedQuestionsWithSortAndFilter,
    findQuestionCount,
    findQuestionCountsByComplexity,
    findQuestionCountWithFilter,
    findRandomQuestionByTopicAndComplexity,
    getFilterKeys,
    getSortKeysAndOrders,
    isValidFilter,
    isValidSort,
    updateQuestion,
} from '../models/question.repository'

import { SortedComplexity } from '@repo/user-types'
import { ValidationError } from 'class-validator'
import { Category } from '../types/Category'
import { CreateQuestionDto } from '../types/CreateQuestionDto'
import { IQuestion } from '../types/IQuestion'
import { QuestionDto } from '../types/QuestionDto'

export async function handleCreateQuestion(
    request: ITypedBodyRequest<CreateQuestionDto>,
    response: Response
): Promise<void> {
    const createDto = CreateQuestionDto.fromRequest(request)
    const errors = await createDto.validate()
    if (errors.length) {
        const errorMessages = errors.flatMap((error: ValidationError) => Object.values(error.constraints))
        response.status(400).json(errorMessages).send()
        return
    }

    const duplicate = await findOneQuestionByTitle(createDto.title)
    if (duplicate) {
        response.status(409).json('DUPLICATE_TITLE').send()
        return
    }

    const question = await createQuestion(createDto)
    const dto = QuestionDto.fromModel(question)
    response.status(201).json(dto).send()
}

export async function handleGetPaginatedQuestions(request: IPaginationRequest, response: Response): Promise<void> {
    const page = parseInt(request.query.page)
    const limit = parseInt(request.query.limit)

    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
        response.status(400).json('INVALID_PAGINATION').send()
        return
    }
    const start = (page - 1) * limit

    const sortBy = request.query.sortBy?.split(',').map((sort) => sort.split(':')) ?? []
    const isSortsValid = sortBy.every(
        (sort: string[]) => sort.at(0) && sort.at(1) && isValidSort(sort.at(0)!, sort.at(1)!)
    )
    if (!isSortsValid) {
        response.status(400).json('INVALID_SORT').send()
        return
    }

    const filterBy = request.query.filterBy?.split(',').map((filter) => filter.split(':')) ?? []
    const isFiltersValid = filterBy.every(
        (filter: string[]) => filter.at(0) && filter.at(1) && isValidFilter(filter.at(0)!)
    )
    if (!isFiltersValid) {
        response.status(400).json('INVALID_FILTER').send()
        return
    }
    // We sort the filters so that title always comes first so that it is a prefix of either the full compound index or the categories compound index
    filterBy.sort((a, b) => (a.at(0) === 'title' && b.at(0) !== 'title' ? -1 : 1))

    // We should probably do singleton pattern for question repository and implement method overloading...
    let count: number
    if (filterBy.length) {
        count = await findQuestionCountWithFilter(filterBy)
    } else {
        count = await findQuestionCount()
    }

    let questions: IQuestion[]
    if (filterBy.length && sortBy.length) {
        questions = await findPaginatedQuestionsWithSortAndFilter(start, limit, sortBy, filterBy)
    } else if (filterBy.length && !sortBy.length) {
        questions = await findPaginatedQuestionsWithFilter(start, limit, filterBy)
    } else if (!filterBy.length && sortBy.length) {
        questions = await findPaginatedQuestionsWithSort(start, limit, sortBy)
    } else {
        questions = await findPaginatedQuestions(start, limit)
    }

    const nextPage = start + limit < count ? page + 1 : null

    response.status(200).json({
        pagination: {
            currentPage: page,
            nextPage,
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            limit,
        },
        questions: questions.map(QuestionDto.fromModel),
    })
}

export async function handleGetQuestionById(request: Request, response: Response): Promise<void> {
    const id = request.params.id

    const question = await findOneQuestionById(id)

    if (!question) {
        response.status(404).json('NOT_FOUND').send()
        return
    }

    const dto = QuestionDto.fromModel(question)
    response.status(200).json(dto).send()
}

export async function handleUpdateQuestion(request: ITypedBodyRequest<QuestionDto>, response: Response): Promise<void> {
    const id = request.params.id
    const updateDto = QuestionDto.fromRequest(request)
    const errors = await updateDto.validate()
    if (errors.length) {
        const errorMessages = errors.flatMap((error: ValidationError) => Object.values(error.constraints))
        response.status(400).json(errorMessages).send()
        return
    }

    const duplicate = await findOneQuestionByTitle(updateDto.title)
    if (duplicate && duplicate.id !== id) {
        response.status(409).json('DUPLICATE_TITLE').send()
        return
    }

    const updatedQuestion = await updateQuestion(id, updateDto)
    if (!updatedQuestion) {
        response.status(404).send()
        return
    }
    const dto = QuestionDto.fromModel(updatedQuestion)
    response.status(200).json(dto).send()
}

export async function handleDeleteQuestion(request: Request, response: Response): Promise<void> {
    const id = request.params.id
    await deleteQuestion(id)
    response.status(204).send()
}

export async function handleGetFilters(request: Request, response: Response): Promise<void> {
    const filters = getFilterKeys()
    response.status(200).json(filters).send()
}

export async function handleGetSorts(request: Request, response: Response): Promise<void> {
    const sorts = getSortKeysAndOrders()
    response.status(200).json(sorts).send()
}

export async function handleGetCategories(request: Request, response: Response): Promise<void> {
    const categories = {
        categories: Object.values(Category),
    }
    response.status(200).json(categories).send()
}

export async function handleGetRandomQuestion(request: Request, response: Response): Promise<void> {
    const topic = request.query.topic
    const complexity = request.query.complexity
    if (!topic || !complexity) {
        response.status(400).json('complexity or topic missing').send()
        return
    }
    if (!Object.values(Category).includes(topic as Category)) {
        response.status(400).json('invalid topic').send()
        return
    }
    if (!Object.values(SortedComplexity).includes(complexity as SortedComplexity)) {
        response.status(400).json('invalid complexity').send()
        return
    }

    const question = await findRandomQuestionByTopicAndComplexity(topic as Category, complexity as SortedComplexity)
    if (!question) {
        response.status(404).json('NOT_FOUND').send()
        return
    }

    response.status(200).json(question).send()
}

export async function handleGetQuestionCounts(_: Request, response: Response): Promise<void> {
    const counts = await findQuestionCountsByComplexity()
    response.status(200).json(counts).send()
}
