import { Router } from 'express'
import passport from 'passport'
import {
    generateWS,
    getMatchDetails,
    handleGetPaginatedSessions,
    handleIsUserInMatch,
    updateCompletion,
} from '../controllers/matching.controller'

const router = Router()

router.put('/', updateCompletion)
router.use(passport.authenticate('jwt', { session: false }))
router.post('/', generateWS)
router.get('/current', handleIsUserInMatch)
router.get('/:id', getMatchDetails)
router.get('/', handleGetPaginatedSessions)

export default router
