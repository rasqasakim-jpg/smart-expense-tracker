import { Router } from "express";
import { AiController } from "../controllers/ai.controller.js";
// Pastikan path middleware auth ini sesuai dengan project-mu
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();
const aiController = new AiController();
const authMiddleware = new AuthMiddleware();
router.get("/insight", authMiddleware.handle, aiController.getInsight);
router.post("/chat", authMiddleware.handle, aiController.chatWithBot);
export default router;
//# sourceMappingURL=ai.routes.js.map
