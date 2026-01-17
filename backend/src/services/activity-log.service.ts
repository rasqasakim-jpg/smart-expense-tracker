import { ActivityLogRepository } from '../repositories/activity-log.repository';
import { ActivityAction } from '../types/activity.types';
import prisma from '../database'; 

export class ActivityLogService {
  private activityLogRepo: ActivityLogRepository;

  constructor() {
    this.activityLogRepo = new ActivityLogRepository(prisma);
  }

  async log(userId: string, action: ActivityAction, description: string) {
    try {
      await this.activityLogRepo.create({ userId, action, description });
    } catch (error) {
      console.error(`[LOG FAILED] Action: ${action} | User: ${userId}`, error);
    }
  }
}