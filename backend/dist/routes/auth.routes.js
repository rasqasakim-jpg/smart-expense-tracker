import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();
// 1. Instansiasi Class
const authController = new AuthController();
const authMiddleware = new AuthMiddleware();
// 2. Route Definitions
// --- Public Routes ---
router.post("/register", authController.register);
router.post("/login", authController.login);
// --- Private Routes (Butuh Token) ---
router.get("/me", authMiddleware.handle, authController.me);
export default router;
//# sourceMappingURL=auth.routes.js.map
