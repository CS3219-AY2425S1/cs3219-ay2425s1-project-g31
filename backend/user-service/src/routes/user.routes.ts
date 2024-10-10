import { Router } from 'express'
import passport from 'passport'
import {
    handleCreateUser,
    handleDeleteUser,
    handleGetCurrentProfile,
    handleUpdatePassword,
    handleUpdateProfile,
} from '../controllers/user.controller'
import { handleOwnershipAccessControl } from '../middlewares/accessControl.middleware'

const router = Router()

router.post('/', handleCreateUser)

router.use(passport.authenticate('jwt', { session: false }))

router.put('/:id', handleOwnershipAccessControl, handleUpdateProfile)
router.get('/:id', handleOwnershipAccessControl, handleGetCurrentProfile)
router.delete('/:id', handleOwnershipAccessControl, handleDeleteUser)
router.put('/:id/password', handleOwnershipAccessControl, handleUpdatePassword)

export default router
