import { PrismaClient } from '../generated'; // Sesuaikan path ini

export class NotificationRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma =  prisma;
 
  }

  async create(data: { userId: string; title: string; content: string }) {
    return this.prisma.notification.create({
      data: {
        user_id: data.userId,
        title: data.title,
        content: data.content,
        is_read: false
      }
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });
  }

  async countUnread(userId: string) {
    return this.prisma.notification.count({
      where: {
        user_id: userId,
        is_read: false
      }
    });
  }

  async markAsRead(id: number, userId: string) {
    const exists = await this.prisma.notification.findFirst({
        where: { id: id, user_id: userId }
    });

    if (!exists) return null;

    return this.prisma.notification.update({
      where: { id: id },
      data: { is_read: true }
    });
  }
}