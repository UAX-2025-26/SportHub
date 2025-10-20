import { Router } from 'express'
import { getHealth } from '../controllers/health.controller.js'
import { optionalAuth } from '../middlewares/auth.js'

const router = Router()

router.get('/health', optionalAuth, getHealth)

export default router

