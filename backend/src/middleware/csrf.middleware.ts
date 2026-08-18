import { Request, Response, NextFunction } from 'express'

export function requireCsrfHeader(req: Request, res: Response, next: NextFunction) {
  const csrfHeader = req.headers['x-requested-with']
  
  if (csrfHeader !== 'XMLHttpRequest') {
    return res.status(403).json({ 
      error: 'CSRF validation failed: X-Requested-With header is required' 
    })
  }
  
  next()
}
