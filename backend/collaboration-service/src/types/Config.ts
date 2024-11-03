import { IsBase64, IsEnum, IsNotEmpty, IsNumberString, IsString, IsUrl, validateOrReject } from 'class-validator'

export class Config {
    @IsEnum(['development', 'production', 'test'])
    NODE_ENV: string

    @IsNumberString()
    @IsNotEmpty()
    PORT: string

    @IsString()
    @IsNotEmpty()
    DB_URL: string

    @IsBase64()
    ACCESS_TOKEN_PUBLIC_KEY: string

    @IsUrl({ require_tld: false })
    USER_SERVICE_URL: string

    @IsUrl({ require_tld: false })
    QUESTION_SERVICE_URL: string

    @IsUrl({ require_tld: false })
    MATCHING_SERVICE_URL: string

    @IsUrl({ require_tld: false })
    JUDGE_ZERO_URL: string

    @IsString()
    @IsNotEmpty()
    JUDGE_ZERO_SUBMIT_CONFIG: string

    constructor(
        NODE_ENV: string,
        PORT: string,
        DB_URL: string,
        ACCESS_TOKEN_PUBLIC_KEY: string,
        USER_SERVICE_URL: string,
        QUESTION_SERVICE_URL: string,
        MATCHING_SERVICE_URL: string,
        JUDGE_ZERO_URL: string,
        JUDGE_ZERO_SUBMIT_CONFIG: string
    ) {
        this.NODE_ENV = NODE_ENV ?? 'development'
        this.PORT = PORT ?? '3006'
        this.DB_URL = DB_URL
        this.ACCESS_TOKEN_PUBLIC_KEY = ACCESS_TOKEN_PUBLIC_KEY
        this.USER_SERVICE_URL = USER_SERVICE_URL
        this.QUESTION_SERVICE_URL = QUESTION_SERVICE_URL
        this.MATCHING_SERVICE_URL = MATCHING_SERVICE_URL
        this.JUDGE_ZERO_URL = JUDGE_ZERO_URL
        this.JUDGE_ZERO_SUBMIT_CONFIG = JUDGE_ZERO_SUBMIT_CONFIG
    }

    static fromEnv(env: { [key: string]: string | undefined }): Config {
        return new Config(
            env.NODE_ENV!,
            env.PORT!,
            env.DB_URL!,
            env.ACCESS_TOKEN_PUBLIC_KEY!,
            env.USER_SERVICE_URL!,
            env.QUESTION_SERVICE_URL!,
            env.MATCHING_SERVICE_URL!,
            env.JUDGE_ZERO_URL!,
            env.JUDGE_ZERO_SUBMIT_CONFIG!
        )
    }

    async validateOrReject(): Promise<void> {
        await validateOrReject(this)
    }
}
