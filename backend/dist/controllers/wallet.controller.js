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
        if (process.env.NODE_ENV === "development") {
            console.log("[wallet] create called from", req.ip || req.hostname, "userId:", userId, "body:", req.body);
        }
        const wallet = await this.walletService.createWallet(userId, req.body);
        if (process.env.NODE_ENV === "development") {
            try {
                console.log(`[wallet] created id=${wallet.id} name=${wallet.name} userId=${userId}`);
            }
            catch (_) { }
        }
        res.status(201).json({
            success: true,
            message: "Operation success",
            data: wallet
        });
    });
    update = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unatuhorized");
        const { id } = req.params;
        if (process.env.NODE_ENV === "development") {
            console.log("[wallet] update called from", req.ip || req.hostname, "userId:", userId, "walletId:", id, "body:", req.body);
        }
        const wallet = await this.walletService.updateWallet(userId, id, req.body);
        if (process.env.NODE_ENV === "development") {
            try {
                console.log(`[wallet] updated id=${wallet.id} name=${wallet.name} userId=${userId}`);
            }
            catch (_) { }
        }
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
        if (process.env.NODE_ENV === "development") {
            console.log("[wallet] delete called from", req.ip || req.hostname, "userId:", userId, "walletId:", id);
        }
        await this.walletService.deleteWallet(userId, id);
        if (process.env.NODE_ENV === "development") {
            console.log(`[wallet] deleted id=${id} by userId=${userId}`);
        }
        res.status(200).json({
            success: true,
            message: "Operation success",
            data: {}
        });
    });
}
//# sourceMappingURL=wallet.controller.js.map
