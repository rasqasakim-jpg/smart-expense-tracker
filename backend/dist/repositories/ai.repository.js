export class AiRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findLatestByUserId(userId) {
        return await this.prisma.financialInsight.findFirst({
            where: { user_id: userId },
            orderBy: { created_at: 'desc' }
        });
    }
    async create(data) {
        return await this.prisma.financialInsight.create({
            data: {
                user_id: data.user_id,
                score: data.score,
                status: data.status,
                message: data.message,
                tips: data.tips,
            },
        });
    }
}
//# sourceMappingURL=ai.repository.js.map