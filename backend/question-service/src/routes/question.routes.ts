// import passport from 'passport'
import {
    handleCreateQuestion,
    handleDeleteQuestion,
    handleGetCategories,
    handleGetFilters,
    handleGetPaginatedQuestions,
    handleGetQuestionById,
    handleGetSorts,
    handleUpdateQuestion,
} from '../controllers/question.controller'

// import { Role } from '@repo/user-types'
import { Router } from 'express'
// import { handleRoleBasedAccessControl } from '../middlewares/accessControl.middleware'

const router = Router()

// router.use(passport.authenticate('jwt', { session: false }))

router.get('/', handleGetPaginatedQuestions)
router.get('/:id', handleGetQuestionById)
// router.post('/', handleRoleBasedAccessControl([Role.ADMIN]), handleCreateQuestion)
// router.put('/:id', handleRoleBasedAccessControl([Role.ADMIN]), handleUpdateQuestion)
// router.delete('/:id', handleRoleBasedAccessControl([Role.ADMIN]), handleDeleteQuestion)
router.post('/', handleCreateQuestion)
router.put('/:id', handleUpdateQuestion)
router.delete('/:id', handleDeleteQuestion)
router.get('/filters', handleGetFilters)
router.get('/sorts', handleGetSorts)
router.get('/categories', handleGetCategories)

export default router
