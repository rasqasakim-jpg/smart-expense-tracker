import prisma from "../database";
import { NotificationRepository } from "../repositories/notification.repository";

export class NotificationService {
    private notificationRepo: NotificationRepository;

    constructor() {
        this.notificationRepo = new NotificationRepository(prisma);
    }
    // [INTERNAL USE ONLY]
    // Method ini dipanggil dari TransactionService, BUKAN dari Controller Notification
    async sendAlert(userId: string, title: string, message: string) {
        return await this.notificationRepo.create({
            userId,
            title,
            content: message
        });
    }


    async getUserNotifications(userId: string) {
        const list = await this.notificationRepo.findAllByUser(userId);
        const unreadCount = await this.notificationRepo.countUnread(userId);

        return {
            unread_count: unreadCount,
            items: list
        };
    }


    async readNotification(userId: string, notifId: number) {
        const result = await this.notificationRepo.markAsRead(notifId, userId);

        if (!result) {
            throw new Error("Notification not found or access denied");
        }

        return result;
    }
}