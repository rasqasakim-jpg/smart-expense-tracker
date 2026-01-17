import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import prisma from '../database';
import { comparePassword } from '../utils/hash';
import { AuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// 1. Instansiasi Class
const authController = new AuthController();
const authMiddleware = new AuthMiddleware();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Autentikasi dan otorisasi user
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register user baru
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Fairuuz
 *               email:
 *                 type: string
 *                 format: email
 *                 example: fairuuz@mail.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: Register berhasil
 *       400:
 *         description: Validasi gagal
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: fairuuz@mail.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login berhasil
 *       401:
 *         description: Email atau password salah
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Ambil data user yang sedang login
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data user berhasil diambil
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/me',
  authMiddleware.handle,
  authController.me
);

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