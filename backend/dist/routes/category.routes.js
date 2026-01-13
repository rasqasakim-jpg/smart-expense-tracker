import { Router } from "express";
import { CategoryController } from "../controllers/category.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();
const categoryController = new CategoryController();
const authMiddleware = new AuthMiddleware();
// Pasang AuthMiddleware agar req.user terisi
router.use(authMiddleware.handle);
// Route Definitions
router.get("/", categoryController.getAll);
router.post("/", categoryController.create);
export default router;
//# sourceMappingURL=category.routes.js.map
