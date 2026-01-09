import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

// Skema untuk validasi isi token agar data req.user terjamin
const tokenSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.string()
});

export class AuthMiddleware {
  // Method untuk verifikasi Token (Verifikasi JWT di Flowchart)
  public handle = (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token tidak ditemukan"
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      const secret = process.env.JWT_SECRET || 'super_secret_key';
      const decoded = jwt.verify(token, secret);

      // Pakai Zod untuk validasi payload token (OOP + Zod)
      const userData = tokenSchema.parse(decoded);

      // Inject data user ke request tanpa interface manual
      req.user = userData;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token tidak valid"
      });
    }
  };

  // Method untuk Check Role (Role Admin? di Flowchart)
  public authorize = (roles: string[]) => {
    return (req: any, res: Response, next: NextFunction) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: Anda tidak memiliki akses"
        });
      }
      next();
    };
  };
}