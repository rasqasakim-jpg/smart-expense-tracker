import { Router } from "express";
import { WalletController } from "../controllers/wallet.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();
const walletController = new WalletController();
const authMiddleware = new AuthMiddleware();
router.use(authMiddleware.handle);
router.get("/", walletController.index);
router.post("/", walletController.create);
router.put("/:id", walletController.update);
router.delete("/:id", walletController.delete);
export default router;
//# sourceMappingURL=wallet.routes.js.map
