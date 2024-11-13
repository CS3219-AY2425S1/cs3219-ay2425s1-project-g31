import { ValidationError } from 'class-validator'
import { Config } from '../types/Config'
import logger from './logger.util'

const config: Config = Config.fromEnv(process.env)
config.validateOrReject().catch((errors: ValidationError[]) => {
    logger.error(
        `[Config] Invalid or missing configuration: ${errors.map((error: ValidationError) => error.property).join(', ')}`
    )
    process.exit(1)
})

export default config
