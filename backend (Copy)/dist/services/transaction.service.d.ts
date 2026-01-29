import type { CreateTransactionDTO, UpdateTransactionDTO } from "../validations/transaction.validation.js";
export declare class TransactionService {
    private transactionRepo;
    private walletRepo;
    private budgetRepo;
    private notificationService;
    private categoryRepo;
    constructor();
    createTransaction(userId: string, data: CreateTransactionDTO): Promise<{
        created_at: Date;
        id: string;
        user_id: string;
        name: string;
        type: import("../../dist/generated/index.js").$Enums.TransactionType;
        deleted_at: Date | null;
        amount: import("@prisma/client-runtime-utils").Decimal;
        note: string | null;
        transaction_date: Date;
        updated_at: Date;
        category_id: number;
        wallet_id: string;
    }>;
    private checkOverBudget;
    getTransactions(userId: string, month?: number, year?: number, type?: string, search?: string, page?: number, limit?: number): Promise<{
        data: ({
            category: {
                id: number;
                name: import("../../dist/generated/index.js").$Enums.CategoryOption;
                type: import("../../dist/generated/index.js").$Enums.TransactionType;
            };
            wallet: {
                id: string;
                name: string;
            };
            attachments: {
                created_at: Date;
                id: string;
                transaction_id: string;
                file_path: string;
                file_type: string;
            }[];
        } & {
            created_at: Date;
            id: string;
            user_id: string;
            name: string;
            type: import("../../dist/generated/index.js").$Enums.TransactionType;
            deleted_at: Date | null;
            amount: import("@prisma/client-runtime-utils").Decimal;
            note: string | null;
            transaction_date: Date;
            updated_at: Date;
            category_id: number;
            wallet_id: string;
        })[];
        meta: {
            page: number;
            limit: number;
            total_items: number;
            total_pages: number;
        };
    }>;
    getTransactionDetail(userId: string, transactionId: string): Promise<{
        category: {
            created_at: Date;
            id: number;
            user_id: string | null;
            name: import("../../dist/generated/index.js").$Enums.CategoryOption;
            type: import("../../dist/generated/index.js").$Enums.TransactionType;
            deleted_at: Date | null;
        };
        wallet: {
            created_at: Date;
            id: string;
            user_id: string;
            name: string;
            type: import("../../dist/generated/index.js").$Enums.WalletType;
            balance: import("@prisma/client-runtime-utils").Decimal;
            deleted_at: Date | null;
        };
    } & {
        created_at: Date;
        id: string;
        user_id: string;
        name: string;
        type: import("../../dist/generated/index.js").$Enums.TransactionType;
        deleted_at: Date | null;
        amount: import("@prisma/client-runtime-utils").Decimal;
        note: string | null;
        transaction_date: Date;
        updated_at: Date;
        category_id: number;
        wallet_id: string;
    }>;
    updateTransaction(userId: string, transactionId: string, data: UpdateTransactionDTO): Promise<{
        created_at: Date;
        id: string;
        user_id: string;
        name: string;
        type: import("../../dist/generated/index.js").$Enums.TransactionType;
        deleted_at: Date | null;
        amount: import("@prisma/client-runtime-utils").Decimal;
        note: string | null;
        transaction_date: Date;
        updated_at: Date;
        category_id: number;
        wallet_id: string;
    }>;
    deleteTransaction(userId: string, transactionId: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=transaction.service.d.ts.map
