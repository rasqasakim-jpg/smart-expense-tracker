// 1. Ubah import dari 'database' ke 'generated'
import { PrismaClient } from '../generated';
export class WalletRepository {
    prisma;
    // 2. Gunakan Constructor Injection
    // (PrismaClient dikirim dari luar, bukan import langsung di sini)
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId) {
        // 3. Pakai 'this.prisma' bukan 'prisma' global
        return await this.prisma.wallet.findMany({
            where: {
                user_id: userId,
                deleted_at: null
            },
            orderBy: { created_at: 'desc' }
        });
    }
    async findById(id) {
        return await this.prisma.wallet.findFirst({
            where: {
                id,
                deleted_at: null
            }
        });
    }
    async create(data) {
        return await this.prisma.wallet.create({
            data
        });
    }
    async update(id, data) {
        return await this.prisma.wallet.update({
            where: { id },
            data
        });
    }
    async delete(id) {
        return await this.prisma.wallet.update({
            where: { id },
            data: {
                deleted_at: new Date()
            }
        });
    }
}
//# sourceMappingURL=wallet.repository.js.map