import { Category, Complexity } from '@repo/question-types'
import { ITypedBodyRequest } from '@repo/request-types'
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsString, IsUrl, ValidationError, validate } from 'class-validator'
import { IQuestion } from './IQuestion'

export class QuestionDto {
    @IsString()
    @IsNotEmpty()
    id: string

    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsArray()
    @IsEnum(Category, { each: true })
    @ArrayNotEmpty()
    categories: Category[]

    @IsEnum(Complexity)
    complexity: Complexity

    @IsUrl()
    link: string

    @IsArray()
    @IsString({ each: true })
    @ArrayNotEmpty()
    @IsNotEmpty({ each: true })
    testInputs: string[]

    @IsArray()
    @IsString({ each: true })
    @ArrayNotEmpty()
    @IsNotEmpty({ each: true })
    testOutputs: string[]

    constructor(
        id: string,
        title: string,
        description: string,
        categories: Category[],
        complexity: Complexity,
        link: string,
        testInputs: string[],
        testOutputs: string[]
    ) {
        this.id = id
        this.title = title
        this.description = description
        this.categories = categories
        this.complexity = complexity
        this.link = link
        this.testInputs = testInputs
        this.testOutputs = testOutputs
    }

    static fromRequest({
        body: { id, title, description, categories, complexity, link, testInputs, testOutputs },
    }: ITypedBodyRequest<QuestionDto>): QuestionDto {
        return new QuestionDto(id, title, description, categories, complexity, link, testInputs, testOutputs)
    }

    static fromModel({
        id,
        title,
        description,
        categories,
        complexity,
        link,
        testInputs,
        testOutputs,
    }: IQuestion): QuestionDto {
        return new QuestionDto(id, title, description, categories, complexity, link, testInputs, testOutputs)
    }

    async validate(): Promise<ValidationError[]> {
        return validate(this)
    }
}
