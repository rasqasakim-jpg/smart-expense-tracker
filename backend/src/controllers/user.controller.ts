import type { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { asyncHandler } from '../utils/asyncHandler';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public updateProfile = asyncHandler(async (req: Request, res: Response) => {
    // Langsung lempar req.user.id dan req.body ke Service.
    // Tanda seru (!) artinya kita yakin req.user ADA (dijamin middleware).
    const updatedUser = await this.userService.updateProfile(
      req.user!.id, 
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Operation success",
      data: updatedUser
    });
  });
}