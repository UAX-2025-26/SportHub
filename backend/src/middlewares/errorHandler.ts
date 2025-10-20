import type { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import { logger } from '../config/logger.js'

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const status = (err as any).status ?? (err instanceof ZodError ? 400 : 500)
  const code = (err as any).code
  const message = err instanceof ZodError ? 'Validation error' : (err.message || 'Internal Server Error')
  const details = err instanceof ZodError ? err.flatten() : (err as any).details

  if (status >= 500) logger.error({ err }, 'Unhandled error')
  else logger.warn({ err }, 'Request error')

  res.status(status).json({
    error: {
      message,
      code,
      status,
      details,
    },
  })
}

