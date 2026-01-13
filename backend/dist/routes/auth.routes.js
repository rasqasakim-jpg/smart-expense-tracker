import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();
// 1. Instansiasi Class
const authController = new AuthController();
const authMiddleware = new AuthMiddleware();
/**
 * @swagger
 * tags:
 * name: Auth
 * description: Authentication & Registration
 */
/**
 * @swagger
 * /api/auth/register:
 * post:
 * summary: Register user baru
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - fullName
 * - email
 * - password
 * properties:
 * fullName:
 * type: string
 * example: "Fairuuz Developer"
 * email:
 * type: string
 * format: email
 * example: "fairuuz@example.com"
 * password:
 * type: string
 * format: password
 * example: "rahasia123"
 * responses:
 * 201:
 * description: Register berhasil
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
 * format: uuid
 * email:
 * type: string
 * full_name:
 * type: string
 * profile:
 * type: object
 * properties:
 * username:
 * type: string
 * 400:
 * description: Validasi gagal atau email sudah terdaftar
 */
router.post("/register", authController.register);
/**
 * @swagger
 * /api/auth/login:
 * post:
 * summary: Login user
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - email
 * - password
 * properties:
 * email:
 * type: string
 * format: email
 * example: "fairuuz@example.com"
 * password:
 * type: string
 * format: password
 * example: "rahasia123"
 * responses:
 * 200:
 * description: Login berhasil
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
 * accessToken:
 * type: string
 * description: JWT Token
 * user:
 * type: object
 * properties:
 * id:
 * type: string
 * email:
 * type: string
 * fullName:
 * type: string
 * role:
 * type: string
 * 401:
 * description: Email atau password salah
 */
router.post("/login", authController.login);
/**
 * @swagger
 * /api/auth/me:
 * get:
 * summary: Cek user yang sedang login (Current User)
 * tags: [Auth]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Data user ditemukan
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * success:
 * type: boolean
 * example: true
 * data:
 * type: object
 * properties:
 * id:
 * type: string
 * email:
 * type: string
 * role:
 * type: string
 * 401:
 * description: Unauthorized (Token tidak valid)
 */
router.get("/me", authMiddleware.handle, authController.me);
export default router;
//# sourceMappingURL=auth.routes.js.map
