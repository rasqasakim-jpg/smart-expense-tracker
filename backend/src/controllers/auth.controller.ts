import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthService } from '../services/auth.service';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = asyncHandler(async (req: Request, res: Response) => {
    // Controller cuma melempar body ke service
    const newUser = await this.authService.registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "Operation success",
      data: newUser
    });
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    // Kita pakai versi HEAD (loginResult & Operation success)
    const loginResult = await this.authService.loginUser(req.body);

    res.status(200).json({
      success: true,
      message: "Operation success",
      data: loginResult 
    });
  });

  // --- AMBIL INI DARI BRANCH fitur-wallet ---
 // ... import dan constructor sama ...

  // register & login TETAP SAMA (karena pakai req.body)

  me = asyncHandler(async (req: Request, res: Response) => {
    // Meskipun AuthMiddleware menjamin, Syntax A tetap good practice
    const user = req.user;
    if (!user) throw new Error("Unauthorized");
    
    res.status(200).json({
      success: true,
      message: "Operation success",
      data: user 
    });
  });
} 