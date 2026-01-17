import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const userController = new UserController();
const authMiddleware = new AuthMiddleware();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Manajemen data user
 */

/**
 * @swagger
 * /api/users/profile:
 *   patch:
 *     tags: [Users]
 *     summary: Update profile user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: fairuuz_z
 *               address:
 *                 type: string
 *                 example: Yogyakarta
 *               occupation:
 *                 type: string
 *                 example: Mahasiswa
 *     responses:
 *       200:
 *         description: Profile berhasil diperbarui
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/profile',
  authMiddleware.handle,
  userController.updateProfile
);

export default router;
