import { PrismaClient } from '../generated'; 
import { ActivityAction } from '../types/activity.types';

export class ActivityLogRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: { userId: string; action: ActivityAction; description: string }) {
    return await this.prisma.activityLog.create({
      data: {
        user_id: data.userId,
        action: data.action,
        description: data.description,
      }
    });
  }
}