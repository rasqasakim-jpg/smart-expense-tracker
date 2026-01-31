// services/wallet.service.ts
import { WalletRepository } from "../repositories/wallet.repository.js";
import prisma from "../database.js";
// 👇 1. Import Enum dari generated prisma
import { WalletType } from "../../dist/generated/index.js";
export class WalletService {
    walletRepo;
    constructor() {
        this.walletRepo = new WalletRepository(prisma);
    }
    async getWallets(userId) {
        return await this.walletRepo.findAll(userId);
    }
    // 👇 2. Terima 'type' sebagai string biasa dari Controller
    async createWallet(userId, data) {
        // --- VALIDASI MANUAL START ---
        // Kita cek: Apakah string yang dikirim user ada di dalam daftar WalletType?
        const isValidType = Object.values(WalletType).includes(data.type);
        if (!isValidType) {
            // Jika tidak cocok, lempar error
            throw new Error(`Tipe wallet '${data.type}' tidak valid. Pilihan: ${Object.values(WalletType).join(", ")}`);
        }
        // --- VALIDASI MANUAL END ---
        // 3. Casting: Karena sudah valid, kita paksa (cast) jadi tipe WalletType
        const typeEnum = data.type;
        return await this.walletRepo.create({
            name: data.name,
            balance: data.balance,
            type: typeEnum, // Repository menerima Enum, bukan string
            user_id: userId
        });
    }
    async updateWallet(userId, walletId, data) {
        const wallet = await this.walletRepo.findById(walletId);
        if (!wallet || wallet.user_id !== userId) {
            const error = new Error("Wallet tidak ditemukan atau akses dilarang");
            error.status = 404;
            throw error;
        }
        const updateData = {
            name: data.name,
            balance: data.balance
        };
        // --- VALIDASI UPDATE ---
        // Cek jika user mengirim field 'type' untuk diupdate
        if (data.type) {
            const isValidType = Object.values(WalletType).includes(data.type);
            if (!isValidType) {
                throw new Error(`Tipe wallet '${data.type}' tidak valid.`);
            }
            // Assign sebagai Enum
            updateData.type = data.type;
        }
        return await this.walletRepo.update(walletId, updateData);
    }
    async deleteWallet(userId, walletId) {
        // ... (sama seperti sebelumnya, tidak ada perubahan karena delete cuma butuh ID)
        const wallet = await this.walletRepo.findById(walletId);
        if (!wallet || wallet.user_id !== userId) {
            const error = new Error("Wallet tidak ditemukan");
            error.status = 404;
            throw error;
        }
        return await this.walletRepo.delete(walletId);
    }
}
//# sourceMappingURL=wallet.service.js.map
