import { Router } from 'express'
import passport from 'passport'
import { getMatchDetails } from '../controllers/collab.controller'

const router = Router()

router.use(passport.authenticate('jwt', { session: false }))

// To change this route to enable retrival of sessions with pagination
router.get('/')
router.post('/', getMatchDetails)

export default router
