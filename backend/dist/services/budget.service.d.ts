export declare class BudgetService {
    private budgetRepo;
    constructor();
    /**
     * Set Budget (Logic Bisnis)
     * Menerima input raw dari Controller dan memproses logic tanggal
     */
    setMonthBudget(userId: string, amount: number, month: number, year: number, categoryId?: number): Promise<{
        created_at: Date;
        id: string;
        user_id: string;
        updated_at: Date;
        category_id: number | null;
        monthly_limit: import("@prisma/client-runtime-utils").Decimal;
        month_year: Date;
    }>;
    /**
     * Get List (Data Mapping)
     * Mengubah format Database (snake_case & Decimal) ke format Frontend (camelCase & Number)
     */
    getBudgetList(userId: string, month: number, year: number): Promise<{
        id: string;
        categoryId: number | null;
        categoryName: string;
        amount: number;
        period: string;
        month: number;
        year: number;
    }[]>;
}
//# sourceMappingURL=budget.service.d.ts.map