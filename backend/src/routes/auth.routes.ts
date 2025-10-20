import { Router } from 'express'
import { getMe } from '../controllers/auth.controller.js'
import { requireAuth } from '../middlewares/auth.js'

const router = Router()

router.get('/auth/me', requireAuth, getMe)

export default router

