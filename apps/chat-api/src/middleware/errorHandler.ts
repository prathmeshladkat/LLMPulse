import { Request, Response, NextFunction } from 'express'

// Global error handler — catches anything thrown in routes
// Without this, unhandled errors crash the server
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('[Error]', err)
  res.status(500).json({
    error: err.message || 'Internal server error'
  })
}