// repositories/wallet.repository.ts
import { PrismaClient, WalletType } from '../generated'; // Import Enum

export class WalletRepository {

  constructor(private prisma: PrismaClient) {}

  async findAll(userId: string) {
    // ... code sama
    return await this.prisma.wallet.findMany({
        where: { user_id: userId, deleted_at: null },
        orderBy: { created_at: 'desc' }
    });
  }

  async findById(id: string) {
    // ... code sama
    return await this.prisma.wallet.findFirst({ 
      where: { id, deleted_at: null }
    });
  }

  // Parameter 'type' di sini WAJIB WalletType (Enum), bukan string
  async create(data: { name: string; type: WalletType; balance: number; user_id: string }) {
    return await this.prisma.wallet.create({
      data: {
        name: data.name,
        type: data.type, // Prisma akan senang menerima ini
        balance: data.balance,
        user_id: data.user_id
      }
    });
  }

  // Parameter 'type' di sini juga WAJIB WalletType
  async update(id: string, data: { name?: string; type?: WalletType; balance?: number }) {
    return await this.prisma.wallet.update({
      where: { id },
      data // Object data sudah sesuai struktur Prisma Update Input
    });
  }

  async delete(id: string) {
    // ... code sama
    return await this.prisma.wallet.update({
        where: { id },
        data: { deleted_at: new Date() }
    });
  }
}