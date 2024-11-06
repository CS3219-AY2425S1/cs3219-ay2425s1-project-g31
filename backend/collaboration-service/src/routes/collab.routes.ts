import { Router } from 'express'
import passport from 'passport'
import { createSessionRequest, getChatHistory, getSession } from '../controllers/collab.controller'

const router = Router()

// Temporarily needs to be disabled to use post
router.use(passport.authenticate('jwt', { session: false }))

router.post('/', createSessionRequest)
router.get('/:id', getSession)
router.get('/chat/:id', getChatHistory)

export default router
