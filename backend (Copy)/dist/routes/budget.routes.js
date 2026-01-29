import { Router } from "express";
import { BudgetController } from "../controllers/budget.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();
const budgetController = new BudgetController();
const authMiddleware = new AuthMiddleware();
router.get("/", authMiddleware.handle, budgetController.getBudgets);
router.post("/", authMiddleware.handle, budgetController.setBudget);
export default router;
//# sourceMappingURL=budget.routes.js.map
