import prisma from "../database.js";
import { NotificationRepository } from "../repositories/notification.repository.js";
export class NotificationService {
    notificationRepo;
    constructor() {
        this.notificationRepo = new NotificationRepository(prisma);
    }
    // [INTERNAL USE ONLY]
    // Method ini dipanggil dari TransactionService, BUKAN dari Controller Notification
    async sendAlert(userId, title, message) {
        return await this.notificationRepo.create({
            userId,
            title,
            content: message
        });
    }
    async getUserNotifications(userId) {
        const list = await this.notificationRepo.findAllByUser(userId);
        const unreadCount = await this.notificationRepo.countUnread(userId);
        return {
            unread_count: unreadCount,
            items: list
        };
    }
    async readNotification(userId, notifId) {
        const result = await this.notificationRepo.markAsRead(notifId, userId);
        if (!result) {
            throw new Error("Notification not found or access denied");
        }
        return result;
    }
}
//# sourceMappingURL=notification.service.js.map
