import type { Response,} from 'express';

export class ErrorMiddleware {
  public handle = (err: any, _req: any, res: Response) => {
    const status = err.status || 500;
    res.status(status).json({
      success: false,
      message: err.message || "Internal Server Error"
    });
  };
}