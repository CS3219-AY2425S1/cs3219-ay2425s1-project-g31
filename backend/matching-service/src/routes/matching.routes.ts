import { Router } from 'express'
import passport from 'passport'
import { generateWS, getMatchDetails } from '../controllers/matching.controller'

const router = Router()

router.use(passport.authenticate('jwt', { session: false }))

router.post('/', generateWS)
router.get('/:matchId', getMatchDetails)

export default router
