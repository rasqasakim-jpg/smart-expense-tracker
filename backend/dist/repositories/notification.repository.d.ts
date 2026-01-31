import { PrismaClient } from "../../dist/generated/index.js";
export declare class NotificationRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    create(data: {
        userId: string;
        title: string;
        content: string;
    }): Promise<{
        created_at: Date;
        id: number;
        user_id: string;
        title: string;
        content: string;
        is_read: boolean;
    }>;
    findAllByUser(userId: string): Promise<{
        created_at: Date;
        id: number;
        user_id: string;
        title: string;
        content: string;
        is_read: boolean;
    }[]>;
    countUnread(userId: string): Promise<number>;
    markAsRead(id: number, userId: string): Promise<{
        created_at: Date;
        id: number;
        user_id: string;
        title: string;
        content: string;
        is_read: boolean;
    } | null>;
}
//# sourceMappingURL=notification.repository.d.ts.map
