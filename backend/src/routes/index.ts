import { Router } from 'express'
import healthRoutes from './health.routes.js'
import authRoutes from './auth.routes.js'

const api = Router()

api.use('/', healthRoutes)
api.use('/', authRoutes)

export default api
