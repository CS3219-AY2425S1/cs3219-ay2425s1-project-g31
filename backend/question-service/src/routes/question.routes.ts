import { Role } from '@repo/user-types'
import { Router } from 'express'
import passport from 'passport'
import {
    handleCreateQuestion,
    handleDeleteQuestion,
    handleGetCategories,
    handleGetFilters,
    handleGetPaginatedQuestions,
    handleGetQuestionById,
    handleGetQuestionCounts,
    handleGetRandomQuestion,
    handleGetSorts,
    handleUpdateQuestion,
} from '../controllers/question.controller'
import { handleRoleBasedAccessControl } from '../middlewares/accessControl.middleware'

const router = Router()

router.get('/random-question', handleGetRandomQuestion)
router.use(passport.authenticate('jwt', { session: false }))
router.get('/complexity/count', handleGetQuestionCounts)
router.get('/', handleGetPaginatedQuestions)
router.get('/:id', handleGetQuestionById)
router.post('/', handleRoleBasedAccessControl([Role.ADMIN]), handleCreateQuestion)
router.put('/:id', handleRoleBasedAccessControl([Role.ADMIN]), handleUpdateQuestion)
router.delete('/:id', handleRoleBasedAccessControl([Role.ADMIN]), handleDeleteQuestion)
router.get('/filters', handleGetFilters)
router.get('/sorts', handleGetSorts)
router.get('/categories', handleGetCategories)

export default router
