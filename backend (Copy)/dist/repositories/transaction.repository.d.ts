import { PrismaClient, Prisma, TransactionType } from "../../dist/generated/index.js";
export interface TransactionFindAllOptions {
    startDate: Date;
    endDate: Date;
    type?: TransactionType | undefined;
    search?: string | undefined;
    page: number;
    limit: number;
}
export declare class TransactionRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    create(data: Prisma.TransactionCreateInput, tx?: Prisma.TransactionClient): Promise<{
        created_at: Date;
        id: string;
        user_id: string;
        name: string;
        type: import("../../dist/generated/index.js").$Enums.TransactionType;
        deleted_at: Date | null;
        amount: Prisma.Decimal;
        note: string | null;
        transaction_date: Date;
        updated_at: Date;
        category_id: number;
        wallet_id: string;
    }>;
    findAll(userId: string, filters: TransactionFindAllOptions): Promise<{
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
            amount: Prisma.Decimal;
            note: string | null;
            transaction_date: Date;
            updated_at: Date;
            category_id: number;
            wallet_id: string;
        })[];
        total: number;
    }>;
    findById(id: string): Promise<({
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
            balance: Prisma.Decimal;
            deleted_at: Date | null;
        };
    } & {
        created_at: Date;
        id: string;
        user_id: string;
        name: string;
        type: import("../../dist/generated/index.js").$Enums.TransactionType;
        deleted_at: Date | null;
        amount: Prisma.Decimal;
        note: string | null;
        transaction_date: Date;
        updated_at: Date;
        category_id: number;
        wallet_id: string;
    }) | null>;
    update(id: string, data: Prisma.TransactionUpdateInput, tx?: Prisma.TransactionClient): Promise<{
        created_at: Date;
        id: string;
        user_id: string;
        name: string;
        type: import("../../dist/generated/index.js").$Enums.TransactionType;
        deleted_at: Date | null;
        amount: Prisma.Decimal;
        note: string | null;
        transaction_date: Date;
        updated_at: Date;
        category_id: number;
        wallet_id: string;
    }>;
    delete(id: string, tx?: Prisma.TransactionClient): Promise<{
        created_at: Date;
        id: string;
        user_id: string;
        name: string;
        type: import("../../dist/generated/index.js").$Enums.TransactionType;
        deleted_at: Date | null;
        amount: Prisma.Decimal;
        note: string | null;
        transaction_date: Date;
        updated_at: Date;
        category_id: number;
        wallet_id: string;
    }>;
    getSummaryStats(userId: string, startDate: Date, endDate: Date): Promise<(Prisma.PickEnumerable<Prisma.TransactionGroupByOutputType, "type"[]> & {
        _sum: {
            amount: Prisma.Decimal | null;
        };
    })[]>;
    getDailyTransactions(useId: string, startDate: Date, endDate: Date): Promise<{
        type: import("../../dist/generated/index.js").$Enums.TransactionType;
        amount: Prisma.Decimal;
        transaction_date: Date;
    }[]>;
    getMonthlyAggregates(userId: string, startDate: Date, endDate: Date): Promise<{
        totalIncome: number;
        totalExpense: number;
    }>;
    getTopExpenses(userId: string, startDate: Date, endDate: Date, limit?: number): Promise<(Prisma.PickEnumerable<Prisma.TransactionGroupByOutputType, "category_id"[]> & {
        _sum: {
            amount: Prisma.Decimal | null;
        };
    })[]>;
    sumExpenseByMonth(userId: string, startDate: Date, endDate: Date, categoryId?: number): Promise<number>;
    findRecent(userId: string, limit: number): Promise<({
        category: {
            created_at: Date;
            id: number;
            user_id: string | null;
            name: import("../../dist/generated/index.js").$Enums.CategoryOption;
            type: import("../../dist/generated/index.js").$Enums.TransactionType;
            deleted_at: Date | null;
        };
    } & {
        created_at: Date;
        id: string;
        user_id: string;
        name: string;
        type: import("../../dist/generated/index.js").$Enums.TransactionType;
        deleted_at: Date | null;
        amount: Prisma.Decimal;
        note: string | null;
        transaction_date: Date;
        updated_at: Date;
        category_id: number;
        wallet_id: string;
    })[]>;
}
//# sourceMappingURL=transaction.repository.d.ts.map
