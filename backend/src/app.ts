import express, { type Application, type Request, type Response } from "express";
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import walletRoutes from './routes/wallet.routes';
import categoryRoutes from './routes/category.routes';
import transactionRoutes from "./routes/transaction.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import { ErrorHandler } from './middlewares/error.handler';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './utils/swagger.config';

// 1. IMPORT RATE LIMITER
// Pastikan path foldernya sesuai ('middleware' atau 'middlewares')
import { RateLimitMiddleware } from './middlewares/rateLimiter.middlerware'; 

const app: Application = express();

// 2. SET TRUST PROXY (WAJIB untuk Railway)
// Taruh ini tepat setelah inisialisasi app
app.set('trust proxy', 1);

app.use(express.json());
app.use(cors()); 

// 3. PASANG GLOBAL LIMITER (Opsional tapi Recommended)
// Ini akan melindungi SEMUA route di bawah ini dari spam ringan
app.use(RateLimitMiddleware.globalLimiter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// === ROUTES ===
// Auth Route ini nanti akan punya 'authLimiter' sendiri di dalam file routes-nya (double protection)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);    
app.use('/api/wallets', walletRoutes); 
app.use('/api/categories', categoryRoutes); 
app.use('/api/transactions', transactionRoutes); 
app.use("/api/dashboard", dashboardRoutes);

app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
        massage: "Selamat datang di API Smart Expanse Tracker",
        status: "Active"
    });
});

app.use(ErrorHandler.handle);
export default app;