import { WalletService } from "../services/wallet.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
export class WalletController {
    walletService;
    constructor() {
        this.walletService = new WalletService;
    }
    index = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const wallets = await this.walletService.getWallets(userId);
        res.status(200).json({
            success: true,
            message: "Operation success",
            data: wallets
        });
    });
    create = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const wallet = await this.walletService.createWallet(userId, req.body);
        res.status(201).json({
            success: true,
            message: "Operation success",
            data: wallet
        });
    });
    update = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (userId)
            throw new Error("Unatuhorized");
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
        if (!userId)
            throw new Error("Unauthorized"); // Validasi
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
