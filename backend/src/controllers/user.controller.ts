import type { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { asyncHandler } from '../utils/asyncHandler';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    
    if (process.env.NODE_ENV === 'development') {

      console.log('[user] updateProfile called from', req.ip || req.hostname, 'userId:', userId, 'body:', req.body);
    }

    const updatedUser = await this.userService.updateProfile(userId, req.body);

    if (process.env.NODE_ENV === 'development') {
      try {
        console.log(`[user] profile updated id=${(updatedUser as any).id} email=${(updatedUser as any).email} userId=${userId}`);
      } catch (_) {}
    }

    res.status(200).json({
      success: true,
      message: "Operation success",
      data: updatedUser
    });
  });
}