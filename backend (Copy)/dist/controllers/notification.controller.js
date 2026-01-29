import { NotificationService } from "../services/notification.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
export class NotificationController {
    notificationService;
    constructor() {
        this.notificationService = new NotificationService();
    }
    getNotifications = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const result = await this.notificationService.getUserNotifications(userId);
        res.status(200).json({
            success: true,
            message: "Operation success",
            data: result
        });
    });
    readNotification = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
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
//# sourceMappingURL=notification.controller.js.map
