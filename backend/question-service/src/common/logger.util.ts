import Winston from 'winston'

export default Winston.createLogger({
    level: 'info',
    format: Winston.format.json(),
    defaultMeta: { service: 'question-service' },
    transports: [
        new Winston.transports.Console(),
        new Winston.transports.File({ filename: 'error.log', level: 'error' }),
        new Winston.transports.File({ filename: 'combined.log' }),
    ],
})
