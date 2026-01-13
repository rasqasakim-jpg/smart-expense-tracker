import { Router } from 'express';
import { WalletController } from '../controllers/wallet.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const walletController = new WalletController();
const authMiddleware = new AuthMiddleware();

// Lightweight ping endpoint to validate connectivity (no auth required)
router.get('/ping', (_req, res) => res.status(200).json({ success: true, message: 'wallets ping OK' }));

router.use(authMiddleware.handle); 

router.get('/', walletController.index);
router.post('/', walletController.create);
router.put('/:id', walletController.update);
router.delete('/:id', walletController.delete);

export default router;