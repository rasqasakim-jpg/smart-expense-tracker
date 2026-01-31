import { ActivityLogRepository } from "../repositories/activity-log.repository.js";
import prisma from "../database.js";
export class ActivityLogService {
    activityLogRepo;
    constructor() {
        this.activityLogRepo = new ActivityLogRepository(prisma);
    }
    async log(userId, action, description) {
        try {
            await this.activityLogRepo.create({ userId, action, description });
        }
        catch (error) {
            console.error(`[LOG FAILED] Action: ${action} | User: ${userId}`, error);
        }
    }
}
//# sourceMappingURL=activity-log.service.js.map
