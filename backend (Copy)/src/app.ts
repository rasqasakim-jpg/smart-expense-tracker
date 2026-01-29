import express, { type Application, type Request, type Response } from "express";
import path from 'path'; // Tambahkan import ini
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import walletRoutes from './routes/wallet.routes';
import categoryRoutes from './routes/category.routes';
import transactionRoutes from "./routes/transaction.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import budgetRoutes from './routes/budget.routes';         
import notificationRoutes from './routes/notification.routes';
import aiRoutes from './routes/ai.routes';
import { ErrorHandler } from './middlewares/error.handler';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './utils/swagger.config';
import { RateLimitMiddleware } from './middlewares/rateLimiter.middlerware'; 

const app: Application = express();

app.set('trust proxy', 1);

app.use(express.json());
app.use(cors()); 

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use(RateLimitMiddleware.globalLimiter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// === ROUTES ===
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);    
app.use('/api/wallets', walletRoutes); 
app.use('/api/categories', categoryRoutes); 
app.use('/api/transactions', transactionRoutes); 
app.use("/api/dashboard", dashboardRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
        massage: "Selamat datang di API Smart Expanse Tracker",
        status: "Active"
    });
});

app.use(ErrorHandler.handle);
export default app;