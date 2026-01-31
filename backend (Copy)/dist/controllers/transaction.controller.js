import { TransactionService } from "../services/transaction.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createTransactionSchema, updateTransactionSchema, queryTransactionSchema } from "../validations/transaction.validation.js";
export class TransactionController {
    service;
    constructor() {
        this.service = new TransactionService();
    }
    // 1. GET ALL (Dengan Pagination, Filter & Search)
    getAll = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        // --- LOG START ---
        if (process.env.NODE_ENV === "development") {
            // Sangat penting melihat raw query sebelum diparse Zod
            // Jika Zod error, kita tahu input aslinya apa.
            console.log("[transaction] getAll called from", req.ip || req.hostname, "userId:", userId, "query:", req.query);
        }
        const query = queryTransactionSchema.parse(req.query);
        const result = await this.service.getTransactions(userId, query.month, query.year, query.type, query.search, query.page, query.limit);
        // --- LOG END ---
        if (process.env.NODE_ENV === "development") {
            try {
                // Log jumlah data & info pagination
                console.log(`[transaction] getAll returned ${result.data.length} items. Page ${result.meta.page}/${result.meta.total_pages}`);
            }
            catch (_) { }
        }
        res.status(200).json({
            success: true,
            message: "Operation success",
            data: result.data,
            meta: {
                ...result.meta,
                filter_month: query.month || new Date().getMonth() + 1,
                filter_year: query.year || new Date().getFullYear(),
                search: query.search || null
            }
        });
    });
    // 2. GET DETAIL (By ID)
    getDetail = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const { id } = req.params;
        // --- LOG START ---
        if (process.env.NODE_ENV === "development") {
            console.log("[transaction] getDetail called for id:", id);
        }
        const transaction = await this.service.getTransactionDetail(userId, id);
        res.status(200).json({
            success: true,
            message: "Operation success",
            data: transaction
        });
    });
    // 3. CREATE
    create = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        // --- LOG START ---
        if (process.env.NODE_ENV === "development") {
            console.log("[transaction] create called from", req.ip || req.hostname, "userId:", userId, "body:", req.body);
        }
        const validatedData = createTransactionSchema.parse(req.body);
        const newTransaction = await this.service.createTransaction(userId, validatedData);
        // --- LOG END ---
        if (process.env.NODE_ENV === "development") {
            try {
                console.log(`[transaction] created id=${newTransaction.id} amount=${newTransaction.amount}`);
            }
            catch (_) { }
        }
        res.status(201).json({
            success: true,
            message: "Operation success",
            data: newTransaction
        });
    });
    // 4. UPDATE
    update = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const { id } = req.params;
        // --- LOG START ---
        if (process.env.NODE_ENV === "development") {
            console.log("[transaction] update called id:", id, "body:", req.body);
        }
        const validatedData = updateTransactionSchema.parse(req.body);
        const updatedTransaction = await this.service.updateTransaction(userId, id, validatedData);
        // --- LOG END ---
        if (process.env.NODE_ENV === "development") {
            try {
                console.log(`[transaction] updated id=${updatedTransaction.id}`);
            }
            catch (_) { }
        }
        res.status(200).json({
            success: true,
            message: "Operation success",
            data: updatedTransaction
        });
    });
    // 5. DELETE
    delete = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const { id } = req.params;
        // --- LOG START ---
        if (process.env.NODE_ENV === "development") {
            console.log("[transaction] delete called id:", id);
        }
        await this.service.deleteTransaction(userId, id);
        // --- LOG END ---
        if (process.env.NODE_ENV === "development") {
            console.log(`[transaction] deleted id=${id}`);
        }
        res.status(200).json({
            success: true,
            message: "Operation success",
            data: {}
        });
    });
}
//# sourceMappingURL=transaction.controller.js.map
