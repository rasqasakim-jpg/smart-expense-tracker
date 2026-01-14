import express, { type Application, type Request, type Response } from "express";
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import walletRoutes from './routes/wallet.routes';
import categoryRoutes from './routes/category.routes';
import transactionRoutes from "./routes/transaction.routes";
import { ErrorHandler } from './middlewares/error.handler';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './utils/swagger.config';

const app: Application = express();
// const errorHandler = new ();

app.use(express.json());
// CORS mengizinkan semua origin (untuk development aman)
app.use(cors()); 

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// === ROUTES ===
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);    
app.use('/api/wallets', walletRoutes); 
app.use('/api/categories', categoryRoutes); 
app.use('/api/transactions', transactionRoutes); 

app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
        massage: "Selamat datang di API Smart Expanse Tracker",
        status: "Active"
    });
});

app.use(ErrorHandler.handle);
export default app;