import type { CreateTransactionDTO, UpdateTransactionDTO } from "../validations/transaction.validation.js";
export declare class TransactionService {
    private transactionRepo;
    private walletRepo;
    constructor();
    createTransaction(userId: string, data: CreateTransactionDTO): Promise<{
        name: string;
        id: string;
        user_id: string;
        created_at: Date;
        type: import("../generated").$Enums.TransactionType;
        deleted_at: Date | null;
        category_id: number;
        wallet_id: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        note: string | null;
        transaction_date: Date;
        updated_at: Date;
    }>;
    getTransactions(userId: string, month?: number, year?: number, type?: string, search?: string): Promise<({
        wallet: {
            name: string;
            id: string;
            user_id: string;
            created_at: Date;
            balance: import("@prisma/client-runtime-utils").Decimal;
            type: string;
            deleted_at: Date | null;
        };
        category: {
            name: string;
            id: number;
            user_id: string | null;
            created_at: Date;
            type: import("../generated").$Enums.TransactionType;
            deleted_at: Date | null;
            icon: string | null;
        };
    } & {
        name: string;
        id: string;
        user_id: string;
        created_at: Date;
        type: import("../generated").$Enums.TransactionType;
        deleted_at: Date | null;
        category_id: number;
        wallet_id: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        note: string | null;
        transaction_date: Date;
        updated_at: Date;
    })[]>;
    getTransactionDetail(userId: string, transactionId: string): Promise<{
        wallet: {
            name: string;
            id: string;
            user_id: string;
            created_at: Date;
            balance: import("@prisma/client-runtime-utils").Decimal;
            type: string;
            deleted_at: Date | null;
        };
        category: {
            name: string;
            id: number;
            user_id: string | null;
            created_at: Date;
            type: import("../generated").$Enums.TransactionType;
            deleted_at: Date | null;
            icon: string | null;
        };
    } & {
        name: string;
        id: string;
        user_id: string;
        created_at: Date;
        type: import("../generated").$Enums.TransactionType;
        deleted_at: Date | null;
        category_id: number;
        wallet_id: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        note: string | null;
        transaction_date: Date;
        updated_at: Date;
    }>;
    updateTransaction(userId: string, transactionId: string, data: UpdateTransactionDTO): Promise<{
        name: string;
        id: string;
        user_id: string;
        created_at: Date;
        type: import("../generated").$Enums.TransactionType;
        deleted_at: Date | null;
        category_id: number;
        wallet_id: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        note: string | null;
        transaction_date: Date;
        updated_at: Date;
    }>;
    deleteTransaction(userId: string, transactionId: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=transaction.service.d.ts.map
