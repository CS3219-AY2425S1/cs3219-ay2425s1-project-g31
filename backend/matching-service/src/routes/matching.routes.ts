import { Router } from 'express'
import passport from 'passport'
import { generateWS } from '../controllers/matching.controller'

const router = Router()

router.use(passport.authenticate('jwt', { session: false }))

router.post('/', generateWS)

export default router
