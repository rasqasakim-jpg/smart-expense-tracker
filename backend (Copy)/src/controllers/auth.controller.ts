import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthService } from '../services/auth.service';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  // 1. REGISTER (Tahap 1: Request OTP)
  register = asyncHandler(async (req: Request, res: Response) => {
    if (process.env.NODE_ENV === 'development') {
      const { password, ...safeBody } = req.body;
      console.log('[auth] register requested:', safeBody);
    }

    // Memanggil requestRegister yang akan kirim OTP & simpan payload
    const result = await this.authService.registerUser(req.body);

    res.status(200).json({
      success: true,
      message: "Kode OTP telah dikirim ke email anda",
      data: result
    });
  });

  // 2. VERIFY OTP (Tahap 2: Finalisasi Pembuatan Akun)
  verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email, code } = req.body; // Sekarang pakai EMAIL, bukan userId

    if (process.env.NODE_ENV === 'development') {
      console.log(`[auth] verifyOtp called for email=${email}`);
    }

    if (!email || !code) {
      throw new Error("Email dan kode OTP wajib diisi");
    }

    // Memanggil logic verifikasi yang sekaligus meng-create user
    const newUser = await this.authService.verifyRegistration(email, code);

    res.status(201).json({ // 201 Created karena akun benar-benar lahir di sini
      success: true,
      message: "Registrasi berhasil, akun anda telah aktif",
      data: newUser
    });
  });

  // 3. LOGIN (Tetap sama)
  login = asyncHandler(async (req: Request, res: Response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[auth] login attempt email:', req.body.email);
    }

    const loginResult = await this.authService.loginUser(req.body);

    res.status(200).json({
      success: true,
      message: "Login berhasil",
      data: loginResult
    });
  });

  // 4. ME (Tetap sama)
  me = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) throw new Error("Unauthorized");

    res.status(200).json({
      success: true,
      message: "Data profile berhasil diambil",
      data: user
    });
  });

  // 5. RESEND OTP
  resendOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      throw new Error("Email wajib diisi");
    }

    const result = await this.authService.resendOtp(email);

    res.status(200).json({
      success: true,
      message: "Kode OTP baru telah dikirim",
      data: result
    });
  });

  // 6. FORGOT PASSWORD
  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      throw new Error("Email wajib diisi");
    }

    const result = await this.authService.requestPasswordReset(email);

    res.status(200).json({
      success: true,
      message: "Instruksi reset password telah dikirim ke email",
      data: result
    });
  });

  // 7. RESET PASSWORD (Finalisasi Reset)
  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    // Service akan memvalidasi email, code, dan newPassword
    const result = await this.authService.resetPassword(req.body);

    res.status(200).json({
      success: true,
      message: "Password anda berhasil diperbarui",
      data: result
    });
  });


  changePassword = asyncHandler(async (req: Request, res: Response) => {
    // Ambil userId dari token (lewat middleware auth)
    const userId = req.user?.id;
    
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const result = await this.authService.changePassword(userId, req.body);

    res.status(200).json({
        success: true,
        message: "Password berhasil diubah",
        data: result
    });
});
}