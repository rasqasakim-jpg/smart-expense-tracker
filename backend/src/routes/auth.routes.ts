import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController(); // Inisialisasi class

router.post('/register', authController.register);
router.post('/login', authController.login); // Tambahkan ini

export default router;