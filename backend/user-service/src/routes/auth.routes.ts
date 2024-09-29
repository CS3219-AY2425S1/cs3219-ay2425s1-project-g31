import { Router } from 'express'
import passport from 'passport'
import { handleLogin, handleReset, handleVerify } from '../controllers/auth.controller'
import { handleValidateToken } from '../controllers/user.controller'

const router = Router()

router.post('/login', passport.authenticate('local', { session: false }), handleLogin)

router.use(passport.authenticate('jwt', { session: false }))

router.get('/token', handleValidateToken)
router.post('/reset', handleReset)
router.post('/verify', handleVerify)

export default router
