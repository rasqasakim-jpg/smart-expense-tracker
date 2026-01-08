import express, {} from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import walletRoutes from "./routes/wallet.routes.js";
import { ErrorHandler } from "./middlewares/error.handler.js";
const app = express();
const errorHandler = new ErrorHandler();
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/wallets", walletRoutes);
app.get("/", (_req, res) => {
    res.status(200).json({
        massage: "Selamat datang di API Smart Expanse Tracker",
        status: "Active"
    });
});
app.use(errorHandler.handle);
export default app;
//# sourceMappingURL=app.js.map
