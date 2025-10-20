import type { Request, Response, NextFunction, RequestHandler } from 'express'

export function asyncHandler<T extends RequestHandler>(fn: T) {
  return function wrapped(req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

