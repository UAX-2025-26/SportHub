import type { RequestHandler } from 'express'
import { getHealthStatus } from '../services/health.service.js'

export const getHealth: RequestHandler = (_req, res) => {
  const payload = getHealthStatus()
  res.json({ data: payload })
}

