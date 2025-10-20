import { createApp } from './app.js'
import { env } from './config/env.js'
import { logger } from './config/logger.js'

const app = createApp()

const server = app.listen(env.PORT, () => {
  logger.info({ port: env.PORT, env: env.NODE_ENV }, 'Server listening')
})

function shutdown(signal: string) {
  logger.info({ signal }, 'Shutting down')
  server.close(() => {
    logger.info('HTTP server closed')
    process.exit(0)
  })
  setTimeout(() => {
    logger.error('Forced shutdown after timeout')
    process.exit(1)
  }, 10_000).unref()
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

