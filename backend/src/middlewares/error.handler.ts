import type { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(`[Error] ${err.message}`);
  if (err.stack) console.error(err.stack);

  const status = err.status || 500;

  res.status(status).json({
    success: false, 
    message: err.message || "Internal Server Error",
    errors: err.errors || undefined 
  });
};