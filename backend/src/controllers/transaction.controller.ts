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

    // 1. GET ALL (Dengan Filter & Search)
    public getAll = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.id;
        if (!userId) throw new Error("Unauthorized");

        // Validasi & Parsing Query Params
        // queryTransactionSchema akan otomatis ubah string "10" jadi number 10
        const query = queryTransactionSchema.parse(req.query);

        const transactions = await this.service.getTransactions(
            userId,
            query.month,
            query.year,
            query.type, // undefined | 'INCOME' | 'EXPENSE'
            query.search
        );

        res.status(200).json({
            success: true,
            message: "Operation success",
            // Tambahkan meta info biar frontend tau data yang ditampilkan bulan apa
            meta: {
                filter_month: query.month || new Date().getMonth() + 1,
                filter_year: query.year || new Date().getFullYear(),
                search: query.search || null
            },
            data: transactions
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