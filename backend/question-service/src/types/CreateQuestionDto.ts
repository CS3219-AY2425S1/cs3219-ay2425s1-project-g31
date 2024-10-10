import { ITypedBodyRequest } from '@repo/request-types'
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsString, IsUrl, ValidationError, validate } from 'class-validator'
import { Category } from './Category'
import { Complexity } from './Complexity'

export class CreateQuestionDto {
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

    constructor(title: string, description: string, categories: Category[], complexity: Complexity, link: string) {
        this.title = title
        this.description = description
        this.categories = categories
        this.complexity = complexity
        this.link = link
    }

    static fromRequest({
        body: { title, description, categories, complexity, link },
    }: ITypedBodyRequest<CreateQuestionDto>): CreateQuestionDto {
        return new CreateQuestionDto(title, description, categories, complexity, link)
    }

    async validate(): Promise<ValidationError[]> {
        return validate(this)
    }
}
