import { Router } from "express";
import { CategoryController } from "../controllers/category.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();
const categoryController = new CategoryController();
const authMiddleware = new AuthMiddleware();
/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Manajemen kategori transaksi (Income & Expense)
 */
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Gaji
 *         type:
 *           type: string
 *           enum: [INCOME, EXPENSE]
 *         icon:
 *           type: string
 *           example: 💰
 *         user_id:
 *           type: string
 *           format: uuid
 *           nullable: true
 */
/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Ambil semua kategori (default + milik user)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INCOME, EXPENSE]
 *         description: Filter kategori berdasarkan tipe transaksi
 *     responses:
 *       200:
 *         description: Daftar kategori berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Operation
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware.handle, categoryController.getAll);
/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Buat kategori baru (milik user)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 example: Makan
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *                 example: EXPENSE
 *               icon:
 *                 type: string
 *                 example: 🍽️
 *     responses:
 *       201:
 *         description: Kategori berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Operation success
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Validasi gagal
 *       401:
 *         description: Unauthorized
 */
router.post("/", authMiddleware.handle, categoryController.create);
export default router;
//# sourceMappingURL=category.routes.js.map
