import { IsNumber, IsOptional, IsString, validate, ValidateNested, ValidationError } from 'class-validator'
import { Type } from 'class-transformer'
import { AxiosResponse } from 'axios'
import 'reflect-metadata'

class StatusDto {
    @IsNumber()
    id: number

    @IsString()
    description: string
}

export class SubmissionResponseDto {
    @IsOptional()
    @IsString()
    stdout: string | null

    @IsOptional()
    @IsString()
    time: string | null

    @IsOptional()
    @IsNumber()
    memory: number | null

    @IsOptional()
    @IsString()
    stderr: string | null

    @IsString()
    token: string

    @IsOptional()
    @IsString()
    compile_output: string | null

    @IsOptional()
    @IsString()
    message: string | null

    @ValidateNested()
    @Type(() => StatusDto)
    status: StatusDto

    constructor(
        stdout: string | null,
        time: string,
        memory: number | null,
        stderr: string | null,
        token: string,
        compile_output: string | null,
        message: string | null,
        status: StatusDto
    ) {
        this.stdout = stdout
        this.time = time
        this.memory = memory
        this.stderr = stderr
        this.token = token
        this.compile_output = compile_output
        this.message = message
        this.status = status
    }

    static fromResponse({
        data: { stdout, time, memory, stderr, token, compile_output, message, status },
    }: AxiosResponse): SubmissionResponseDto {
        return new SubmissionResponseDto(stdout, time, memory, stderr, token, compile_output, message, status)
    }

    async validate(): Promise<ValidationError[]> {
        return validate(this)
    }
}
