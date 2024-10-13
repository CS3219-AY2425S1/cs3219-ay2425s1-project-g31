import Winston from 'winston'

export default Winston.createLogger({
    level: 'info',
    format: Winston.format.combine(
        Winston.format.printf(({ level, message }) => {
            return `[${level}]: ${message}`
        })
    ),
    defaultMeta: { service: 'matching-service' },
    transports: [
        new Winston.transports.Console(),
        new Winston.transports.File({ filename: 'error.log', level: 'error' }),
        new Winston.transports.File({ filename: 'combined.log' }),
    ],
})
