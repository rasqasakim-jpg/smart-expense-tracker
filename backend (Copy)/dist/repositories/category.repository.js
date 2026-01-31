export class CategoryRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId, type) {
        return await this.prisma.category.findMany({
            where: {
                OR: [
                    { user_id: null },
                    { user_id: userId }
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
                type: data.type,
                user_id: data.user_id
            }
        });
    }
    async findById(id) {
        return await this.prisma.category.findUnique({
            where: { id }
        });
    }
}
//# sourceMappingURL=category.repository.js.map