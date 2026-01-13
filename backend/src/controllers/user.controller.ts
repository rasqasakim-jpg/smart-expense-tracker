import type { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { asyncHandler } from '../utils/asyncHandler';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public updateProfile = asyncHandler(async (req: Request, res: Response) => {
    // Syntax A
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    // Masuk ke service aman tanpa tanda seru
    const updatedUser = await this.userService.updateProfile(userId, req.body);

    res.status(200).json({
      success: true,
      message: "Operation success",
      data: updatedUser
    });
  });
}