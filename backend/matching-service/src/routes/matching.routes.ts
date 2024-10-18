import { Router } from 'express'
import passport from 'passport'
import { addUserToMatchingQueue, removeUserFromMatchingQueue } from '../controllers/matching.controller'

const router = Router()

router.use(passport.authenticate('jwt', { session: false }))

router.post('/', addUserToMatchingQueue)
router.post('/cancel', removeUserFromMatchingQueue)

export default router
