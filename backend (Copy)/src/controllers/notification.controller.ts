import type { Request, Response } from 'express';
import { NotificationService } from '../services/notification.service';
import { asyncHandler } from '../utils/asyncHandler';

export class NotificationController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  public getNotifications = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const result = await this.notificationService.getUserNotifications(userId);

    res.status(200).json({
      success: true,
      message: "Operation success",
      data: result
    });
  });

 
  public readNotification = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const notificationId = Number(req.params.id);
    if (isNaN(notificationId)) {
        throw new Error("Invalid Notification ID");
    }

    await this.notificationService.readNotification(userId, notificationId);

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: null
    });
  });
}