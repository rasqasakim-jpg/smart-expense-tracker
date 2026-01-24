// services/wallet.service.ts
import { WalletRepository } from '../repositories/wallet.repository';
import prisma from '../database';
// 👇 1. Import Enum dari generated prisma
import { WalletType } from '../generated'; 

export class WalletService { 
    private walletRepo: WalletRepository;

    constructor() {
        this.walletRepo = new WalletRepository(prisma);
    }

    async getWallets(userId: string) {
        return await this.walletRepo.findAll(userId);
    }

    // 👇 2. Terima 'type' sebagai string biasa dari Controller
    async createWallet(userId: string, data: { name: string; type: string; balance: number }) {
       
       // --- VALIDASI MANUAL START ---
       // Kita cek: Apakah string yang dikirim user ada di dalam daftar WalletType?
       const isValidType = Object.values(WalletType).includes(data.type as any);

       if (!isValidType) {
           // Jika tidak cocok, lempar error
           throw new Error(`Tipe wallet '${data.type}' tidak valid. Pilihan: ${Object.values(WalletType).join(', ')}`);
       }
       // --- VALIDASI MANUAL END ---

       // 3. Casting: Karena sudah valid, kita paksa (cast) jadi tipe WalletType
       const typeEnum = data.type as WalletType;

       return await this.walletRepo.create({
           name: data.name,
           balance: data.balance,
           type: typeEnum, // Repository menerima Enum, bukan string
           user_id: userId
       });
    }

    async updateWallet(userId: string, walletId: string, data: { name?: string; type?: string; balance?: number }) {
        const wallet = await this.walletRepo.findById(walletId);
        
        if (!wallet || wallet.user_id !== userId) {
            const error: any = new Error("Wallet tidak ditemukan atau akses dilarang");
            error.status = 404;
            throw error;
        }

        const updateData: any = {
            name: data.name,
            balance: data.balance
        };

        // --- VALIDASI UPDATE ---
        // Cek jika user mengirim field 'type' untuk diupdate
        if (data.type) {
            const isValidType = Object.values(WalletType).includes(data.type as any);
            
            if (!isValidType) {
                 throw new Error(`Tipe wallet '${data.type}' tidak valid.`);
            }

            // Assign sebagai Enum
            updateData.type = data.type as WalletType;
        }

        return await this.walletRepo.update(walletId, updateData);
    }

    async deleteWallet(userId: string, walletId: string) {
        // ... (sama seperti sebelumnya, tidak ada perubahan karena delete cuma butuh ID)
        const wallet = await this.walletRepo.findById(walletId);
        if (!wallet || wallet.user_id !== userId) {
            const error: any = new Error("Wallet tidak ditemukan");
            error.status = 404;
            throw error;
        }
        return await this.walletRepo.delete(walletId);
    }
}