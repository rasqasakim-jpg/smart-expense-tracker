import type { Request, Response, NextFunction } from 'express';

export class ErrorHandler {
  // Proper Express error handler signature: (err, req, res, next)
  public handle = (err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err?.status || 500;

    // Ensure we return JSON for API clients
    res.status(status).json({
      success: false,
      message: err?.message || 'Internal Server Error',
      // In development, include stack for easier debugging
      ...(process.env.NODE_ENV === 'development' && { stack: err?.stack }),
    });
  };
}