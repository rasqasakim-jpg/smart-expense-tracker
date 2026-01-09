import express, { type Application, type Request, type Response } from "express";
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';     // Dari HEAD (saya benerin typonya // jadi /)
import walletRoutes from './routes/wallet.routes'; // Dari fitur-wallet
import { ErrorHandler } from './middlewares/error.handler';

const app: Application = express();
const errorHandler = new ErrorHandler();

app.use(express.json());
app.use(cors());

// --- ROUTES REGISTRATION ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);     // Route User masuk
app.use('/api/wallets', walletRoutes); // Route Wallet masuk

app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
        massage: "Selamat datang di API Smart Expanse Tracker",
        status: "Active"
    });
});

app.use(errorHandler.handle);
export default app;