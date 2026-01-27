import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { RateLimitMiddleware } from '../middlewares/rateLimiter.middlerware';

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
router.post('/register', RateLimitMiddleware.authLimiter,authController.register);

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
router.post('/login', RateLimitMiddleware.authLimiter, authController.login);


router.post('/verify-otp', RateLimitMiddleware.authLimiter, authController.verifyOtp)


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


router.post(
  '/resend-otp', 
  RateLimitMiddleware.authLimiter,
  authController.resendOtp
);


router.post(
  '/forgot-password', 
  RateLimitMiddleware.authLimiter, 
  authController.forgotPassword // Langsung panggil method
);

router.post(
  '/reset-password', 
  RateLimitMiddleware.authLimiter, 
  authController.resetPassword // Langsung panggil method
);

export default router;