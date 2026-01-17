export class WalletRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId) {
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