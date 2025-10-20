import { env } from '../config/env.js'

export type HealthStatus = {
  status: 'ok'
  uptime: number
  timestamp: string
  env: string
}

export function getHealthStatus(): HealthStatus {
  return {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    env: env.NODE_ENV,
  }
}

