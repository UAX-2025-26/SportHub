import type { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { HttpError } from '../utils/HttpError.js'

export type JwtPayloadUser = {
  sub: string
  email?: string
  roles?: string[]
}

function parseBearer(token?: string) {
  if (!token) return undefined
  const [scheme, value] = token.split(' ')
  if (scheme !== 'Bearer' || !value) return undefined
  return value
}

export const optionalAuth: RequestHandler = (req, _res, next) => {
  const raw = req.headers.authorization
  const token = parseBearer(raw)
  if (!token) return next()
  if (!env.JWT_SECRET) return next()
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload & JwtPayloadUser
    req.user = { id: decoded.sub as string, email: decoded.email, roles: decoded.roles }
    next()
  } catch {
    // Ignore invalid token for optional auth
    next()
  }
}

export const requireAuth: RequestHandler = (req, _res, next) => {
  if (!env.JWT_SECRET) throw new HttpError(500, 'JWT secret not configured', 'CONFIG')
  const raw = req.headers.authorization
  const token = parseBearer(raw)
  if (!token) throw new HttpError(401, 'Missing bearer token', 'AUTH_MISSING')
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload & JwtPayloadUser
    req.user = { id: decoded.sub as string, email: decoded.email, roles: decoded.roles }
    next()
  } catch {
    throw new HttpError(401, 'Invalid token', 'AUTH_INVALID')
  }
}

