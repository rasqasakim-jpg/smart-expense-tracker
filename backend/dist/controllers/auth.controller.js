import { asyncHandler } from "../utils/asyncHandler.js";
import { AuthService } from "../services/auth.service.js";
export class AuthController {
    authService;
    constructor() {
        this.authService = new AuthService();
    }
    register = asyncHandler(async (req, res) => {
        // Controller cuma melempar body ke service
        const newUser = await this.authService.registerUser(req.body);
        res.status(201).json({
            success: true,
            message: "Operation success",
            data: newUser
        });
    });
    login = asyncHandler(async (req, res) => {
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
    me = asyncHandler(async (req, res) => {
        // Meskipun AuthMiddleware menjamin, Syntax A tetap good practice
        const user = req.user;
        if (!user)
            throw new Error("Unauthorized");
        res.status(200).json({
            success: true,
            message: "Operation success",
            data: user
        });
    });
}
//# sourceMappingURL=auth.controller.js.map
