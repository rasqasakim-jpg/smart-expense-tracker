import { WalletRepository } from "../repositories/wallet.repository.js";
import prisma from "../database.js"; // <--- Import singleton prisma di sini
export class WalletService {
    walletRepo;
    constructor() {
        this.walletRepo = new WalletRepository(prisma);
    }
    async getWallets(userId) {
        return await this.walletRepo.findAll(userId);
    }
    async createWallet(userId, data) {
        return await this.walletRepo.create({
            ...data,
            user_id: userId
        });
    }
    // Kita pakai 'any' di sini supaya tidak ribet, tapi tetap validasi logic kepemilikan
    async updateWallet(userId, walletId, data) {
        const wallet = await this.walletRepo.findById(walletId);
        // Validasi: Kalau wallet gak ada ATAU bukan punya user yang login -> Error
        if (!wallet || wallet.user_id !== userId) {
            const error = new Error("Wallet tidak ditemukan atau akses dilarang");
            error.status = 404; // Set 404 Not Found
            throw error;
        }
        // Kita filter sedikit agar user tidak sembarang update ID
        return await this.walletRepo.update(walletId, {
            name: data.name,
            type: data.type,
            balance: data.balance
        });
    }
    async deleteWallet(userId, walletId) {
        const wallet = await this.walletRepo.findById(walletId);
        if (!wallet || wallet.user_id !== userId) {
            const error = new Error("Wallet tidak ditemukan atau akses dilarang");
            error.status = 404;
            throw error;
        }
        return await this.walletRepo.delete(walletId);
    }
}
//# sourceMappingURL=wallet.service.js.map
