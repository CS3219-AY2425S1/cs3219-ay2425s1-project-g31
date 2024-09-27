import { IPaginationRequest, ITypedBodyRequest } from '@repo/request-types'
import { ValidationError } from 'class-validator'
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
    findQuestionCountWithFilter,
    updateQuestion,
} from '../models/question.repository'
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
        const errorMessages = errors.map((error: ValidationError) => `INVALID_${error.property.toUpperCase()}`)
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
    const isValidSort = sortBy.every(
        (sort: string[]) => sort.at(0) && sort.at(1) && QuestionDto.isValidSort(sort.at(0)!, sort.at(1)!)
    )
    if (!isValidSort) {
        response.status(400).json('INVALID_SORT').send()
        return
    }

    const filterBy = request.query.filterBy?.split(',').map((filter) => filter.split(':')) ?? []
    const isValidFilter = filterBy.every(
        (filter: string[]) => filter.at(0) && filter.at(1) && QuestionDto.isValidFilter(filter.at(0)!)
    )
    if (!isValidFilter) {
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
        const errorMessages = errors.map((error: ValidationError) => `INVALID_${error.property.toUpperCase()}`)
        response.status(400).json(errorMessages).send()
        return
    }

    const duplicate = await findOneQuestionByTitle(updateDto.title)
    if (duplicate) {
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
