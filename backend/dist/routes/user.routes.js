import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js"; // Import Middleware
const router = Router();
const userController = new UserController();
const authMiddleware = new AuthMiddleware(); // Inisialisasi Middleware
// Route Private (Butuh Token)
// Endpoint: /api/users/profile
router.patch("/profile", authMiddleware.handle, // Middleware dipasang di sini
userController.updateProfile);
export default router;
//# sourceMappingURL=user.routes.js.map
