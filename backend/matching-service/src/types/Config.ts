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

    @IsString()
    RMQ_USER: string

    @IsString()
    RMQ_PASSWORD: string

    @IsString()
    RMQ_HOST: string

    constructor(
        NODE_ENV: string,
        PORT: string,
        DB_URL: string,
        ACCESS_TOKEN_PUBLIC_KEY: string,
        USER_SERVICE_URL: string,
        QUESTION_SERVICE_URL: string,
        RMQ_USER: string,
        RMQ_PASSWORD: string,
        RMQ_HOST: string
    ) {
        this.NODE_ENV = NODE_ENV ?? 'development'
        this.PORT = PORT ?? '3006'
        this.DB_URL = DB_URL
        this.ACCESS_TOKEN_PUBLIC_KEY = ACCESS_TOKEN_PUBLIC_KEY
        this.USER_SERVICE_URL = USER_SERVICE_URL
        this.QUESTION_SERVICE_URL = QUESTION_SERVICE_URL
        this.RMQ_USER = RMQ_USER || 'guest'
        this.RMQ_PASSWORD = RMQ_PASSWORD || 'guest'
        this.RMQ_HOST = RMQ_HOST
    }

    static fromEnv(env: { [key: string]: string | undefined }): Config {
        return new Config(
            env.NODE_ENV!,
            env.PORT!,
            env.DB_URL!,
            env.ACCESS_TOKEN_PUBLIC_KEY!,
            env.USER_SERVICE_URL!,
            env.QUESTION_SERVICE_URL!,
            env.RMQ_USER!,
            env.RMQ_PASSWORD!,
            env.RMQ_HOST!
        )
    }

    async validateOrReject(): Promise<void> {
        await validateOrReject(this)
    }
}
