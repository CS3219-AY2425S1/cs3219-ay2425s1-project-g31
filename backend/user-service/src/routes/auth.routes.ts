import { handleLogin, handleReset, handleUpdate, handleVerify } from '../controllers/auth.controller'

import { Router } from 'express'
import { handleValidateToken } from '../controllers/user.controller'
import passport from 'passport'

const router = Router()

router.post('/login', passport.authenticate('local', { session: false }), handleLogin)

router.use(passport.authenticate('jwt', { session: false }))

router.get('/token', handleValidateToken)
router.post('/reset', handleReset)
router.post('/verify', handleVerify)
router.post('/update', handleUpdate)

export default router
