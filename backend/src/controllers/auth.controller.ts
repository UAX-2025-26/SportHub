import type { RequestHandler } from 'express'

export const getMe: RequestHandler = (req, res) => {
  res.json({ data: req.user })
}

