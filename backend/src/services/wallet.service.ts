import { WalletRepository } from '../repositories/wallet.repository';
import prisma from '../database'; // <--- Import singleton prisma di sini
export class WalletService { 
    private walletRepo: WalletRepository;

    constructor() {
        this.walletRepo = new WalletRepository(prisma);
    }

    async getWallets(userId: string) {
        return await this.walletRepo.findAll(userId);
    }

    async createWallet(userId: string, data: { name: string; type: string; balance: number }) {
       return await this.walletRepo.create({
        ...data,
        user_id: userId
       });
    }

  async updateWallet(userId: string, walletId: string, data: any) {
    const wallet = await this.walletRepo.findById(walletId);
    
    if (!wallet || wallet.user_id !== userId) {
      const error: any = new Error("Wallet tidak ditemukan atau akses dilarang");
      error.status = 404; // Set 404 Not Found
      throw error;
    }

    return await this.walletRepo.update(walletId, {
        name: data.name,
        type: data.type,
        balance: data.balance
    });
  }

  async deleteWallet(userId: string, walletId: string) {
    const wallet = await this.walletRepo.findById(walletId);
    
    if (!wallet || wallet.user_id !== userId) {
      const error: any = new Error("Wallet tidak ditemukan atau akses dilarang");
      error.status = 404;
      throw error;
    }

    return await this.walletRepo.delete(walletId);
  }
}