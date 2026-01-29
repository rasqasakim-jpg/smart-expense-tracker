import { PrismaClient } from "../../dist/generated/index.js";
import { ActivityAction } from "../types/activity.types.js";
export declare class ActivityLogRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    create(data: {
        userId: string;
        action: ActivityAction;
        description: string;
    }): Promise<{
        action: string;
        description: string | null;
        created_at: Date;
        id: number;
        user_id: string;
    }>;
}
//# sourceMappingURL=activity-log.repository.d.ts.map
