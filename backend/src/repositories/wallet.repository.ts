import prisma from '../database';

export class WalletRepository {

  async findAll(userId: string) {
    return await prisma.wallet.findMany({
      where: { 
        user_id: userId,
        deleted_at: null // Ambil yang belum dihapus saja
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async findById(id: string) {
    return await prisma.wallet.findFirst({ 
      where: { 
        id,
        deleted_at: null 
      }
    });
  }

  async create(data: { name: string; type: string; balance: number; user_id: string }) {
    return await prisma.wallet.create({
      data
    });
  }

  async update(id: string, data: { name?: string; type?: string; balance?: number }) {
    return await prisma.wallet.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    // Soft Delete: Isi tanggal hari ini ke deleted_at
    return await prisma.wallet.update({
      where: { id },
      data: {
        deleted_at: new Date()
      }
    });
  }
}