import { WalletService } from "../services/wallet.service.js";
import { asyncHandler } from "../utils/asyncHandler.js"; // Pastikan path benar
export class WalletController {
    walletService;
    constructor() {
        this.walletService = new WalletService();
    }
    // Bungkus dengan asyncHandler agar error otomatis dilempar ke NextFunction
    index = asyncHandler(async (req, res) => {
        const userId = req.user?.id; // Menggunakan Custom Request Type kamu
        const wallets = await this.walletService.getWallets(userId);
        res.status(200).json({
            success: true,
            message: "Operation success",
            data: wallets
        });
    });
    create = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        const wallet = await this.walletService.createWallet(userId, req.body);
        res.status(201).json({
            success: true,
            message: "Operation success",
            data: wallet
        });
    });
    update = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        const { id } = req.params;
        const wallet = await this.walletService.updateWallet(userId, id, req.body);
        res.status(200).json({
            success: true,
            message: "Operation success",
            data: wallet
        });
    });
    delete = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        const { id } = req.params;
        await this.walletService.deleteWallet(userId, id);
        res.status(200).json({
            success: true,
            message: "Operation success",
            data: {}
        });
    });
}
//# sourceMappingURL=wallet.controller.js.map
