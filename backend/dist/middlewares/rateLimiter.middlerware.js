import rateLimit from 'express-rate-limit';
export class RateLimitMiddleware {
    static globalLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            status: 'error',
            message: 'Terlalu banyak request dari IP ini, silakan coba lagi setelah 15 menit.'
        }
    });
    static authLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 10,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            status: 'error',
            message: 'Terlalu banyak percoban login gagal. Demi keamanan , tunggu 15 menit.'
        }
    });
    static transactionLimiter = rateLimit({
        windowMs: 60 * 60 * 1000,
        max: 60,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            status: 'error',
            message: 'Kamu menginput data terlalu cepat. Santai dulu sejenak.'
        }
    });
}
//# sourceMappingURL=rateLimiter.middlerware.js.map