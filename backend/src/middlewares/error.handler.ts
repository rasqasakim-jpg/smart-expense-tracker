// src/middlewares/error.middleware.ts (atau utils/ErrorHandler.ts)
import type { Request, Response, NextFunction } from 'express';

export class ErrorHandler {
  // Ubah jadi STATIC biar gampang dipanggil tanpa 'new ErrorHandler()'
  public static handle(
    err: any, 
    _req: Request, 
    res: Response, 
    _next: NextFunction // <--- INI WAJIB ADA!
  ) {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    
    // Opsional: Log error di console server biar developer tau (jangan dimakan sendiri)
    if (status === 500) {
        console.error("🔥 SERVER ERROR:", err);
    }

    res.status(status).json({
      success: false,
      message: message
    });
  }
}