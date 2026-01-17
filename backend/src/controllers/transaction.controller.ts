import type { Request, Response } from "express";
import { TransactionService } from "../services/transaction.service";
import { asyncHandler } from "../utils/asyncHandler";
// Import Schema Zod yang sudah kamu buat
import { 
    createTransactionSchema, 
    updateTransactionSchema, 
    queryTransactionSchema 
} from "../validations/transaction.validation";

export class TransactionController {
    private service: TransactionService;

    constructor() {
        this.service = new TransactionService();
    }

    // 1. GET ALL (Dengan Pagination, Filter & Search)
    public getAll = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.id;
        if (!userId) throw new Error("Unauthorized");

        // Validasi & Parsing Query Params via Zod
        // Pastikan schema Zod kamu sudah support page & limit (lihat langkah 2 di bawah)
        const query = queryTransactionSchema.parse(req.query);

        // Panggil Service dengan 7 parameter
        const result = await this.service.getTransactions(
            userId,
            query.month,
            query.year,
            query.type,     
            query.search,
            query.page,     // Tambahkan ini (dari Zod)
            query.limit     // Tambahkan ini (dari Zod)
        );

        // Format Response
        // Kita pecah result (yang isinya .data dan .meta) agar JSON rapi
        res.status(200).json({
            success: true,
            message: "Operation success",
            data: result.data, // Array transaksi langsung di root 'data'
            meta: {
                ...result.meta, // Meta pagination (page, total_pages, dll)
                // Meta tambahan untuk filter yang sedang aktif
                filter_month: query.month || new Date().getMonth() + 1,
                filter_year: query.year || new Date().getFullYear(),
                search: query.search || null
            }
        });
    });

    // 2. GET DETAIL (By ID)
    public getDetail = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.id;
        if (!userId) throw new Error("Unauthorized");

        const { id } = req.params;
        const transaction = await this.service.getTransactionDetail(userId, id!);

        res.status(200).json({
            success: true,
            message: "Operation success",
            data: transaction
        });
    });

    // 3. CREATE
    public create = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.id;
        if (!userId) throw new Error("Unauthorized");

        // Validasi Body pakai Zod Create Schema
        const validatedData = createTransactionSchema.parse(req.body);

        const newTransaction = await this.service.createTransaction(userId, validatedData);

        res.status(201).json({
            success: true,
            message: "Operation success",
            data: newTransaction
        });
    });

    // 4. UPDATE
    public update = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.id;
        if (!userId) throw new Error("Unauthorized");

        const { id } = req.params;
        
        // Validasi Body pakai Zod Update Schema (Partial)
        const validatedData = updateTransactionSchema.parse(req.body);

        const updatedTransaction = await this.service.updateTransaction(userId, id!, validatedData);

        res.status(200).json({
            success: true,
            message: "Operation success",
            data: updatedTransaction
        });
    });

    // 5. DELETE
    public delete = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.id;
        if (!userId) throw new Error("Unauthorized");

        const { id } = req.params;
        await this.service.deleteTransaction(userId, id!);

        res.status(200).json({
            success: true,
            message: "Operation success",
            data: {} // Data kosong karena delete
        });
    });
}