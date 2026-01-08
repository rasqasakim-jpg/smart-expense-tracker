import { Router } from "express";
import { WalletController } from "../controllers/wallet.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();
const walletController = new WalletController();
const authMiddleware = new AuthMiddleware();
// Semua route di bawah ini butuh login, jadi kita pasang middleware di level router
// agar tidak perlu pasang satu-satu di setiap baris.
router.use(authMiddleware.handle);
router.get("/", walletController.index);
router.post("/", walletController.create);
router.put("/:id", walletController.update);
router.delete("/:id", walletController.delete);
export default router;
//# sourceMappingURL=wallet.routes.js.map
