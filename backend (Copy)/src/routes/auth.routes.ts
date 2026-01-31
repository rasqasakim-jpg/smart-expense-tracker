import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { RateLimitMiddleware } from '../middlewares/rateLimiter.middlerware';

const router = Router();

const authController = new AuthController();
const authMiddleware = new AuthMiddleware();

// --- PUBLIC ROUTES (Akses Tanpa Token) ---
router.post('/register', RateLimitMiddleware.authLimiter, authController.register);
router.post('/verify-otp', RateLimitMiddleware.authLimiter, authController.verifyOtp);
router.post('/login', RateLimitMiddleware.authLimiter, authController.login);
router.post('/resend-otp', RateLimitMiddleware.authLimiter, authController.resendOtp);
router.post('/forgot-password', RateLimitMiddleware.authLimiter, authController.forgotPassword);
router.post('/reset-password', RateLimitMiddleware.authLimiter, authController.resetPassword);


// --- PROTECTED ROUTES (Butuh Token) ---
router.use(authMiddleware.handle); 

// 7. Get Profile Data
router.get('/me', authController.me);

// 8. Change Password
// Sekarang aman karena sudah melewati "Gerbang" di atas
router.post('/change-password', RateLimitMiddleware.authLimiter, authController.changePassword);

export default router;