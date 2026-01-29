import { ActivityAction } from "../types/activity.types.js";
export declare class ActivityLogService {
    private activityLogRepo;
    constructor();
    log(userId: string, action: ActivityAction, description: string): Promise<void>;
}
//# sourceMappingURL=activity-log.service.d.ts.map
