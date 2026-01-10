import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthService } from '../services/auth.service';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  // Gunakan arrow function agar tidak perlu bind(this) di router
  register = asyncHandler(async (req: Request, res: Response) => {
    if (process.env.NODE_ENV === 'development') {
      const { email } = req.body || {};
      // Never log plaintext passwords — show email and redact password here
      console.log('[auth] register called from', req.ip || req.hostname, 'email:', email, 'password: [REDACTED]');
    }

    const newUser = await this.authService.registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "Operation success",
      data: newUser
    });
  });


  login = asyncHandler(async (req: Request, res: Response) => {
    if (process.env.NODE_ENV === 'development') {
      const { email } = req.body || {};
      // Never log plaintext passwords — show email and redact password here
      console.log('[auth] login called from', req.ip || req.hostname, 'email:', email, 'password: [REDACTED]');
    }

    const loginData = await this.authService.loginUser(req.body);

    // Response Format Standard
    res.status(200).json({
      success: true,
      message: "Operation success",
      data: loginData
    });
  });


}