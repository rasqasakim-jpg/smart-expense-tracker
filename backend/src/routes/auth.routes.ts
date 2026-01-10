import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import prisma from '../database';
import { comparePassword } from '../utils/hash';

const router = Router();
const authController = new AuthController(); // Inisialisasi class

router.post('/register', authController.register);
router.post('/login', authController.login); // Tambahkan ini

// Development-only helper: verify stored hash for an email (DO NOT ENABLE IN PRODUCTION)
if (process.env.NODE_ENV === 'development') {
  router.post('/dev/verify', async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(200).json({ match: false, reason: 'user not found' });

    const match = await comparePassword(password, user.password);
    return res.status(200).json({ match });
  });

  router.get('/dev/user', async (req, res) => {
    const email = String(req.query.email || '');
    if (!email) return res.status(400).json({ message: 'email query param required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(200).json({ found: false });

    return res.status(200).json({ found: true, id: user.id, email: user.email, created_at: user.created_at, hashPrefix: String(user.password).slice(0, 10), hashLength: String(user.password).length });
  });
}

export default router;