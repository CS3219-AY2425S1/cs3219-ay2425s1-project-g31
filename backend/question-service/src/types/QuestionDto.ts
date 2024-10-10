import { ITypedBodyRequest } from '@repo/request-types'
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsString, IsUrl, ValidationError, validate } from 'class-validator'
import { Category } from './Category'
import { Complexity } from './Complexity'
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

    constructor(
        id: string,
        title: string,
        description: string,
        categories: Category[],
        complexity: Complexity,
        link: string
    ) {
        this.id = id
        this.title = title
        this.description = description
        this.categories = categories
        this.complexity = complexity
        this.link = link
    }

    static fromRequest({
        body: { id, title, description, categories, complexity, link },
    }: ITypedBodyRequest<QuestionDto>): QuestionDto {
        return new QuestionDto(id, title, description, categories, complexity, link)
    }

    static fromModel({ id, title, description, categories, complexity, link }: IQuestion): QuestionDto {
        return new QuestionDto(id, title, description, categories, complexity, link)
    }

    async validate(): Promise<ValidationError[]> {
        return validate(this)
    }
}
