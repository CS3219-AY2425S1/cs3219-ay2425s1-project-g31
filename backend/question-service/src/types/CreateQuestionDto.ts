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
        title: string,
        description: string,
        categories: Category[],
        complexity: Complexity,
        link: string,
        testInputs: string[],
        testOutputs: string[]
    ) {
        this.title = title
        this.description = description
        this.categories = categories
        this.complexity = complexity
        this.link = link
        this.testInputs = testInputs
        this.testOutputs = testOutputs
    }

    static fromRequest({
        body: { title, description, categories, complexity, link, testInputs, testOutputs },
    }: ITypedBodyRequest<CreateQuestionDto>): CreateQuestionDto {
        return new CreateQuestionDto(title, description, categories, complexity, link, testInputs, testOutputs)
    }

    async validate(): Promise<ValidationError[]> {
        return validate(this)
    }
}
