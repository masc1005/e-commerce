import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface JwtPayload {
  id: string
  email: string
  type: string
  clientId?: string
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ error: 'Token not provided' })
    }

    const [, token] = authHeader.split(' ')

    if (!token) {
      return res.status(401).json({ error: 'Token not provided' })
    }

    const secret = process.env.JWT_SECRET

    if (!secret) {
      return res.status(500).json({ error: 'JWT secret not configured' })
    }

    const decoded = jwt.verify(token, secret) as JwtPayload

    req.user = decoded

    return next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

// Optional auth middleware - doesn't fail if no token is provided
// Used for routes that can be accessed both authenticated and unauthenticated
export const optionalAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return next() // Continue without authentication
    }

    const [, token] = authHeader.split(' ')

    if (!token) {
      return next() // Continue without authentication
    }

    const secret = process.env.JWT_SECRET

    if (!secret) {
      return next() // Continue without authentication
    }

    const decoded = jwt.verify(token, secret) as JwtPayload
    req.user = decoded

    return next()
  } catch (error) {
    // Invalid token, but continue anyway (will be handled by use case)
    return next()
  }
}
