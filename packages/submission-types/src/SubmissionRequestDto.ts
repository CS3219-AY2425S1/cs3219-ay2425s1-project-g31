import { IsNotEmpty, IsNumber, IsString, validate, ValidationError } from 'class-validator'
import 'reflect-metadata'

export class SubmissionRequestDto {
    @IsNumber()
    @IsNotEmpty()
    language_id: number

    @IsString()
    source_code: string

    @IsString()
    stdin: string

    @IsString()
    expected_output: string

    constructor(language_id: number, source_code: string, expected_output: string, stdin?: string) {
        this.language_id = language_id
        this.source_code = source_code
        this.stdin = stdin || ''
        this.expected_output = expected_output
    }

    async validate(): Promise<ValidationError[]> {
        return validate(this)
    }
}
