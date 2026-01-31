import { Router } from "express";
import { WalletController } from "../controllers/wallet.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();
const walletController = new WalletController();
const authMiddleware = new AuthMiddleware();
/**
 * @swagger
 * tags:
 *   - name: Wallets
 *     description: Manajemen dompet user
 */
/**
 * @swagger
 * /wallets:
 *   get:
 *     tags: [Wallets]
 *     summary: Ambil semua wallet milik user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List wallet berhasil diambil
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       name:
 *                         type: string
 *                         example: Dompet Utama
 *                       type:
 *                         type: string
 *                         example: CASH
 *                       balance:
 *                         type: number
 *                         example: 500000
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware.handle, walletController.index);
/**
 * @swagger
 * /wallets:
 *   post:
 *     tags: [Wallets]
 *     summary: Buat wallet baru
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
 *               - balance
 *             properties:
 *               name:
 *                 type: string
 *                 example: Dompet BCA
 *               type:
 *                 type: string
 *                 example: BANK
 *               balance:
 *                 type: number
 *                 example: 1000000
 *     responses:
 *       201:
 *         description: Wallet berhasil dibuat
 *       400:
 *         description: Validasi gagal
 *       401:
 *         description: Unauthorized
 */
router.post("/", authMiddleware.handle, walletController.create);
/**
 * @swagger
 * /wallets/{id}:
 *   put:
 *     tags: [Wallets]
 *     summary: Update wallet
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
 *                 example: Dompet Utama
 *               type:
 *                 type: string
 *                 example: CASH
 *               balance:
 *                 type: number
 *                 example: 750000
 *     responses:
 *       200:
 *         description: Wallet berhasil diupdate
 *       404:
 *         description: Wallet tidak ditemukan
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", authMiddleware.handle, walletController.update);
/**
 * @swagger
 * /wallets/{id}:
 *   delete:
 *     tags: [Wallets]
 *     summary: Hapus wallet (soft delete)
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
 *         description: Wallet berhasil dihapus
 *       404:
 *         description: Wallet tidak ditemukan
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", authMiddleware.handle, walletController.delete);
export default router;
//# sourceMappingURL=wallet.routes.js.map
