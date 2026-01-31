export class NotificationRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.notification.create({
            data: {
                user_id: data.userId,
                title: data.title,
                content: data.content,
                is_read: false
            }
        });
    }
    async findAllByUser(userId) {
        return this.prisma.notification.findMany({
            where: { user_id: userId },
            orderBy: { created_at: 'desc' }
        });
    }
    async countUnread(userId) {
        return this.prisma.notification.count({
            where: {
                user_id: userId,
                is_read: false
            }
        });
    }
    async markAsRead(id, userId) {
        const exists = await this.prisma.notification.findFirst({
            where: { id: id, user_id: userId }
        });
        if (!exists)
            return null;
        return this.prisma.notification.update({
            where: { id: id },
            data: { is_read: true }
        });
    }
}
//# sourceMappingURL=notification.repository.js.map