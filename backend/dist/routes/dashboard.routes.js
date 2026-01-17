import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller.js";
// Pastikan path middleware auth ini benar sesuai project kamu
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();
const dashboardController = new DashboardController();
const authMiddleware = new AuthMiddleware();
// Endpoint: GET /api/dashboard
router.get("/", authMiddleware.handle, dashboardController.getStats);
export default router;
//# sourceMappingURL=dashboard.routes.js.map
