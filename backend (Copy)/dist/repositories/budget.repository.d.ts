import { PrismaClient, Budget } from "../../dist/generated/index.js";
export declare class BudgetRepository {
    private prisma;
    constructor(prismaClient: PrismaClient);
    /**
     * Create or Update Budget
     * Menggunakan upsert agar atomik (thread-safe)
     */
    upsertBudget(userId: string, amount: number, date: Date, categoryId: number | null): Promise<Budget>;
    /**
     * Find All Budgets by Month
     * Mengambil semua budget user di bulan tertentu beserta info kategorinya
     */
    findAllByMonth(userId: string, date: Date): Promise<({
        category: {
            created_at: Date;
            id: number;
            user_id: string | null;
            name: import("../../dist/generated/index.js").$Enums.CategoryOption;
            type: import("../../dist/generated/index.js").$Enums.TransactionType;
            deleted_at: Date | null;
        } | null;
    } & {
        created_at: Date;
        id: string;
        user_id: string;
        updated_at: Date;
        category_id: number | null;
        monthly_limit: import("@prisma/client-runtime-utils").Decimal;
        month_year: Date;
    })[]>;
}
//# sourceMappingURL=budget.repository.d.ts.map
