import { Request, Response, NextFunction } from 'express'
import * as yup from 'yup'

export const validate =
  (schema: yup.Schema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.body, { abortEarly: false })
      next()
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.inner.map((err) => ({
            field: err.path || 'unknown',
            message: err.message,
          })),
        })
      }
      next(error)
    }
  }

export const validateParams =
  (schema: yup.Schema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.params, { abortEarly: false })
      next()
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return res.status(400).json({
          error: 'Invalid parameters',
          details: error.inner.map((err) => ({
            field: err.path || 'unknown',
            message: err.message,
          })),
        })
      }
      next(error)
    }
  }

export const validateQuery =
  (schema: yup.Schema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.query, { abortEarly: false })
      next()
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return res.status(400).json({
          error: 'Invalid query parameters',
          details: error.inner.map((err) => ({
            field: err.path || 'unknown',
            message: err.message,
          })),
        })
      }
      next(error)
    }
  }
