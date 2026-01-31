export declare class NotificationService {
    private notificationRepo;
    constructor();
    sendAlert(userId: string, title: string, message: string): Promise<{
        created_at: Date;
        id: number;
        user_id: string;
        title: string;
        content: string;
        is_read: boolean;
    }>;
    getUserNotifications(userId: string): Promise<{
        unread_count: number;
        items: {
            created_at: Date;
            id: number;
            user_id: string;
            title: string;
            content: string;
            is_read: boolean;
        }[];
    }>;
    readNotification(userId: string, notifId: number): Promise<{
        created_at: Date;
        id: number;
        user_id: string;
        title: string;
        content: string;
        is_read: boolean;
    }>;
}
//# sourceMappingURL=notification.service.d.ts.map