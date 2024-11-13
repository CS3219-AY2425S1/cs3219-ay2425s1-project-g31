import 'dotenv/config'
import http, { Server } from 'http'
import { autoInsertQuestions } from './common/autoinsert.util'
import config from './common/config.util'
import logger from './common/logger.util'
import connectToDatabase from './common/mongodb.util'
import index from './index'

const server: Server = http.createServer(index)
server.listen(config.PORT, async () => {
    logger.info(`[Init] Server is listening on port ${config.PORT}`)
})

connectToDatabase(config.DB_URL).then(() => autoInsertQuestions())
