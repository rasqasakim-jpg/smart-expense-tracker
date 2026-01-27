import type { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { asyncHandler } from '../utils/asyncHandler';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }


  public getProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const user = await this.userService.getProfile(userId);

    // Tips Mentor: Kita bisa bantu frontend dengan kasih URL lengkap untuk avatar
    // Tapi return path saja juga sudah cukup.

    res.status(200).json({
      success: true,
      message: "Berhasil mengambil data profile",
      data: user
    });
  });


  public updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    // 1. Tangkap file dari req.file (disediakan oleh multer)
    const file = req.file;

    if (process.env.NODE_ENV === 'development') {
      console.log('[user] updateProfile called from', req.ip || req.hostname, {
        userId,
        body: req.body,
        file: file ? file.filename : 'No file uploaded'
      });
    }

    // 2. Gabungkan body data dengan path file avatar (jika ada)
    // Pastikan di UserService, method updateProfile sudah menerima field 'avatar'
    const updateData = {
      ...req.body,
      ...(file && { avatar: file.path })
    };

    // 3. Kirim data yang sudah digabung ke service
    const updatedUser = await this.userService.updateProfile(userId, updateData);

    if (process.env.NODE_ENV === 'development') {
      try {
        console.log(`[user] profile updated id=${(updatedUser as any).id} userId=${userId}`);
      } catch (_) { }
    }

    res.status(200).json({
      success: true,
      message: "Operation success",
      data: updatedUser
    });
  });
}