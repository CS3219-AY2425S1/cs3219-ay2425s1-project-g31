import { Router } from 'express'
import passport from 'passport'
import { createSessionRequest, getChatHistory, getSession } from '../controllers/collab.controller'

const router = Router()

router.post('/', createSessionRequest)

router.use(passport.authenticate('jwt', { session: false }))

router.get('/:id', getSession)
router.get('/chat/:id', getChatHistory)

export default router
