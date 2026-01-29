export class ActivityLogRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return await this.prisma.activityLog.create({
            data: {
                user_id: data.userId,
                action: data.action,
                description: data.description,
            }
        });
    }
}
//# sourceMappingURL=activity-log.repository.js.map