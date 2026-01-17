import { PrismaClient, Prisma, TransactionType } from "../generated";
export class TransactionRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    // Create dengan support transaction client (tx)
    async create(data, tx) {
        const client = tx || this.prisma;
        return await client.transaction.create({ data });
    }
    // Find All dengan Filter Tanggal & Search
    async findAll(userId, filters) {
        const whereCondition = {
            user_id: userId,
            deleted_at: null,
            transaction_date: {
                gte: filters.startDate,
                lte: filters.endDate
            },
            ...(filters.type && { type: filters.type }),
        };
        // Logic Search (Name OR Note)
        if (filters.search) {
            whereCondition.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { note: { contains: filters.search, mode: 'insensitive' } }
            ];
        }
        return await this.prisma.transaction.findMany({
            where: whereCondition,
            include: {
                category: true,
                wallet: true
            },
            orderBy: { transaction_date: "desc" },
        });
    }
    // Find One by ID
    async findById(id) {
        return await this.prisma.transaction.findFirst({
            where: { id, deleted_at: null },
            include: { category: true, wallet: true }
        });
    }
    // Update Data
    async update(id, data, tx) {
        const client = tx || this.prisma;
        return await client.transaction.update({
            where: { id },
            data
        });
    }
    // Soft Delete
    async delete(id, tx) {
        const client = tx || this.prisma;
        return await client.transaction.update({
            where: { id },
            data: { deleted_at: new Date() }
        });
    }
}
//# sourceMappingURL=transaction.repository.js.map