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
    const newUser = await this.authService.registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "Operation success",
      data: newUser
    });
  });


  login = asyncHandler(async (req: Request, res: Response) => {
    const loginData = await this.authService.loginUser(req.body);

    // Response Format Standard
    res.status(200).json({
      success: true,
      message: "Operation success",
      data: loginData
    });
  });


}