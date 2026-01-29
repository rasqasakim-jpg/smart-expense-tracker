import { Router } from "express";
import { TransactionController } from "../controllers/transaction.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { RateLimitMiddleware } from "../middlewares/rateLimiter.middlerware";

const router = Router();
const controller = new TransactionController();
const auth = new AuthMiddleware();

/**
 * @swagger
 * tags:
 *   - name: Transactions
 *     description: Manajemen Transaksi (Pemasukan & Pengeluaran)
 */

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Ambil daftar transaksi
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Data berhasil diambil
 *       401:
 *         description: Unauthorized
 */
router.get("/", auth.handle, controller.getAll);

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Ambil detail satu transaksi
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Detail transaksi ditemukan
 *       404:
 *         description: Transaksi tidak ditemukan
 */
router.get("/:id", auth.handle, controller.getDetail);

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Buat transaksi baru
 *     tags: [Transactions]
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
 *               - amount
 *               - type
 *               - wallet_id
 *               - category_id
 *               - transaction_date
 *             properties:
 *               name:
 *                 type: string
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *               wallet_id:
 *                 type: string
 *                 format: uuid
 *               category_id:
 *                 type: integer
 *               transaction_date:
 *                 type: string
 *                 format: date-time
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transaksi berhasil dibuat
 *       400:
 *         description: Validasi gagal
 */
router.post("/", auth.handle, RateLimitMiddleware.transactionLimiter, controller.create);

/**
 * @swagger
 * /transactions/{id}:
 *   put:
 *     summary: Update transaksi
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *               category_id:
 *                 type: integer
 *               transaction_date:
 *                 type: string
 *                 format: date-time
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transaksi berhasil diupdate
 *       404:
 *         description: Transaksi tidak ditemukan
 */
router.put("/:id", auth.handle, RateLimitMiddleware.transactionLimiter, controller.update);

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Hapus transaksi
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Transaksi berhasil dihapus
 *       404:
 *         description: Transaksi tidak ditemukan
 */
router.delete("/:id", auth.handle, RateLimitMiddleware.transactionLimiter, controller.delete);

export default router;
