import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import apiRouter from './routes/index.js'
import { httpLogger } from './config/logger.js'
import { notFound } from './middlewares/notFound.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { env } from './config/env.js'

export function createApp() {
  const app = express()

  app.disable('x-powered-by')

  app.use(cors({ origin: env.CORS_ORIGIN ?? '*', credentials: false }))
  app.use(helmet())
  app.use(compression())
  app.use(express.json({ limit: '1mb' }))
  app.use(express.urlencoded({ extended: false }))
  app.use(httpLogger)

  app.get('/', (_req, res) => {
    res.json({ data: { name: 'SportHub API', version: 1 } })
  })

  app.use('/api/v1', apiRouter)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
