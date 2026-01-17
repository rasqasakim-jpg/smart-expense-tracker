import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import walletRoutes from "./routes/wallet.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import { ErrorHandler } from "./middlewares/error.handler.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./utils/swagger.config.js";
const app = express();
// const errorHandler = new ();
app.use(express.json());
// CORS mengizinkan semua origin (untuk development aman)
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// === ROUTES ===
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wallets", walletRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.get("/", (_req, res) => {
    res.status(200).json({
        massage: "Selamat datang di API Smart Expanse Tracker",
        status: "Active"
    });
});
app.use(ErrorHandler.handle);
export default app;
//# sourceMappingURL=app.js.map
