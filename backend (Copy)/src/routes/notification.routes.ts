import { Router } from "express";
import { NotificationController } from '../controllers/notification.controller';
import { AuthMiddleware } from "../middlewares/auth.middleware";

const router = Router()
const notificationController = new NotificationController()
const authController = new AuthMiddleware()

router.get('/', authController.handle, notificationController.getNotifications);
router.patch('/:id/read', authController.handle, notificationController.readNotification);

export default router;