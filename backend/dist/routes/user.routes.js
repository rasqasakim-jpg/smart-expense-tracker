import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();
const userController = new UserController();
const authMiddleware = new AuthMiddleware();
/**
 * @swagger
 * tags:
 * name: Users
 * description: User Management & Profile
 */
/**
 * @swagger
 * /api/users/profile:
 * patch:
 * summary: Update profile user
 * tags: [Users]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * fullName:
 * type: string
 * example: "Fairuuz Baru"
 * username:
 * type: string
 * example: "fairuuz_dev"
 * address:
 * type: string
 * example: "Jakarta, Indonesia"
 * occupation:
 * type: string
 * example: "Backend Developer"
 * dateOfBirth:
 * type: string
 * format: date
 * example: "1999-12-31"
 * responses:
 * 200:
 * description: Profile berhasil diupdate
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * success:
 * type: boolean
 * example: true
 * message:
 * type: string
 * example: "Operation success"
 * data:
 * type: object
 * properties:
 * id:
 * type: string
 * full_name:
 * type: string
 * profile:
 * type: object
 * properties:
 * username:
 * type: string
 * address:
 * type: string
 * occupation:
 * type: string
 * date_of_birth:
 * type: string
 * 400:
 * description: Username sudah digunakan atau format salah
 * 401:
 * description: Unauthorized
 */
router.patch("/profile", authMiddleware.handle, userController.updateProfile);
export default router;
//# sourceMappingURL=user.routes.js.map
