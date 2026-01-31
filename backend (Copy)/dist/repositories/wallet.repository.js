export class WalletRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId) {
        // ... code sama
        return await this.prisma.wallet.findMany({
            where: { user_id: userId, deleted_at: null },
            orderBy: { created_at: 'desc' }
        });
    }
    async findById(id) {
        // ... code sama
        return await this.prisma.wallet.findFirst({
            where: { id, deleted_at: null }
        });
    }
    // Parameter 'type' di sini WAJIB WalletType (Enum), bukan string
    async create(data) {
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
    async update(id, data) {
        return await this.prisma.wallet.update({
            where: { id },
            data // Object data sudah sesuai struktur Prisma Update Input
        });
    }
    async delete(id) {
        // ... code sama
        return await this.prisma.wallet.update({
            where: { id },
            data: { deleted_at: new Date() }
        });
    }
}
//# sourceMappingURL=wallet.repository.js.map