import { PrismaClient, TransactionType } from '../generated';
export class CategoryRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(useId, type) {
        return await this.prisma.category.findMany({
            where: {
                OR: [
                    { user_id: null },
                    { user_id: useId }
                ],
                ...(type && { type: type }),
                deleted_at: null
            },
            orderBy: { id: 'asc' }
        });
    }
    async create(data) {
        return await this.prisma.category.create({
            data: {
                name: data.name,
                icon: data.icon ?? null,
                type: data.type,
                user_id: data.user_id
            }
        });
    }
}
//# sourceMappingURL=category.repository.js.map