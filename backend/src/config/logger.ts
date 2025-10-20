import pino from 'pino'
import { pinoHttp } from 'pino-http'
import type { IncomingMessage, ServerResponse } from 'http'
import { env } from './env.js'

const isDev = env.NODE_ENV !== 'production'

export const logger = pino({
  level: env.LOG_LEVEL,
  transport: isDev
    ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard' } }
    : undefined,
  base: { env: env.NODE_ENV },
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'res.headers.set-cookie', 'password', '*.password'],
    remove: true,
  },
})

export const httpLogger = pinoHttp({
  logger,
  autoLogging: true,
  customLogLevel: function (_req: IncomingMessage, res: ServerResponse, err?: Error) {
    if (err || res.statusCode >= 500) return 'error'
    if (res.statusCode >= 400) return 'warn'
    return 'info'
  },
})
