import { Router } from 'express'
import passport from 'passport'
import { createSessionRequest, getChatHistory, getSession } from '../controllers/collab.controller'

const router = Router()

router.use(passport.authenticate('jwt', { session: false }))

// To change this route to enable retrival of sessions with pagination
router.put('/', createSessionRequest)
router.get('/:id', getSession)
router.get('/chat/:id', getChatHistory)

export default router
