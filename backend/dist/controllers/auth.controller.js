import { asyncHandler } from "../utils/asyncHandler.js";
import { AuthService } from "../services/auth.service.js";
export class AuthController {
    authService;
    constructor() {
        this.authService = new AuthService();
    }
    register = asyncHandler(async (req, res) => {
        const newUser = await this.authService.registerUser(req.body);
        res.status(201).json({
            success: true,
            message: "Register berhasil",
            data: newUser
        });
    });
    login = asyncHandler(async (req, res) => {
        const loginData = await this.authService.loginUser(req.body);
        res.status(200).json({
            success: true,
            message: "Login berhasil",
            data: loginData
        });
    });
    // REVISI: Hapus try-catch, gunakan asyncHandler
    me = asyncHandler(async (req, res) => {
        // Karena pakai AuthMiddleware, req.user otomatis terisi
        // Jika user tidak ada (token invalid), middleware akan error duluan sebelum masuk sini
        res.status(200).json({
            success: true,
            message: "Profile user berhasil diambil",
            data: req.user
        });
    });
}
//# sourceMappingURL=auth.controller.js.map
