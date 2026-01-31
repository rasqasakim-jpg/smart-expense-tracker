import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { uploadAvatar } from '../middlewares/upload.middleware';

const router = Router();
const userController = new UserController();
const authMiddleware = new AuthMiddleware();

// 👇 Route baru untuk melihat profile
// Method: GET
// Endpoint: /api/users/profile
router.get(
    '/profile',
    authMiddleware.handle, 
    userController.getProfile
);

// Route update yang tadi (PUT/PATCH)
router.put(
  '/profile', 
  authMiddleware.handle, 
  uploadAvatar.single('avatar'), 
  userController.updateProfile
);

export default router;