import { IsBase64, IsEmail, IsEnum, IsNotEmpty, IsNumberString, IsString, validateOrReject } from 'class-validator'

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
    ACCESS_TOKEN_PRIVATE_KEY: string

    @IsBase64()
    ACCESS_TOKEN_PUBLIC_KEY: string

    @IsEmail()
    NODEMAILER_EMAIL: string

    @IsString()
    @IsNotEmpty()
    NODEMAILER_PASSWORD: string

    constructor(
        NODE_ENV: string,
        PORT: string,
        DB_URL: string,
        ACCESS_TOKEN_PRIVATE_KEY: string,
        ACCESS_TOKEN_PUBLIC_KEY: string,
        NODEMAILER_EMAIL: string,
        NODEMAILER_PASSWORD: string
    ) {
        this.NODE_ENV = NODE_ENV ?? 'development'
        this.PORT = PORT ?? '3002'
        this.DB_URL = DB_URL
        this.ACCESS_TOKEN_PRIVATE_KEY = ACCESS_TOKEN_PRIVATE_KEY
        this.ACCESS_TOKEN_PUBLIC_KEY = ACCESS_TOKEN_PUBLIC_KEY
        this.NODEMAILER_EMAIL = NODEMAILER_EMAIL
        this.NODEMAILER_PASSWORD = NODEMAILER_PASSWORD
    }

    static fromEnv(env: { [key: string]: string | undefined }): Config {
        return new Config(
            env.NODE_ENV!,
            env.PORT!,
            env.DB_URL!,
            env.ACCESS_TOKEN_PRIVATE_KEY!,
            env.ACCESS_TOKEN_PUBLIC_KEY!,
            env.NODEMAILER_EMAIL!,
            env.NODEMAILER_PASSWORD!
        )
    }

    async validateOrReject(): Promise<void> {
        await validateOrReject(this)
    }
}
