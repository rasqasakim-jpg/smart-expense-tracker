import { BudgetRepository } from "../repositories/budget.repository.js";
import prisma from "../database.js"; // Pastikan path instance prisma benar
export class BudgetService {
    budgetRepo;
    constructor() {
        this.budgetRepo = new BudgetRepository(prisma);
    }
    /**
     * Set Budget (Logic Bisnis)
     * Menerima input raw dari Controller dan memproses logic tanggal
     */
    async setMonthBudget(userId, amount, month, year, categoryId) {
        if (amount < 0)
            throw new Error("Budget tidak boleh negatif");
        // Validasi Bulan (1-12)
        if (month < 1 || month > 12)
            throw new Error("Bulan tidak valid");
        // Buat Date Object: (Year, MonthIndex 0-11, Day 1)
        const targetDate = new Date(year, month - 1, 1);
        // Pastikan categoryId menjadi null jika undefined (untuk Global Budget)
        const targetCategory = categoryId !== undefined ? categoryId : null;
        return await this.budgetRepo.upsertBudget(userId, amount, targetDate, targetCategory);
    }
    /**
     * Get List (Data Mapping)
     * Mengubah format Database (snake_case & Decimal) ke format Frontend (camelCase & Number)
     */
    async getBudgetList(userId, month, year) {
        // Validasi Bulan
        if (month < 1 || month > 12)
            throw new Error("Bulan tidak valid");
        const targetDate = new Date(year, month - 1, 1);
        const budgets = await this.budgetRepo.findAllByMonth(userId, targetDate);
        // Mapping response
        return budgets.map(b => {
            // Prisma Decimal dikembalikan sebagai Object/String, perlu convert ke Number
            const limitNumber = Number(b.monthly_limit);
            return {
                id: b.id,
                categoryId: b.category_id, // Kirim ID kategori juga
                categoryName: b.category ? b.category.name : "Global Budget",
                amount: limitNumber, // Frontend property: amount
                period: "MONTHLY", // Hardcode sementara karena skema DB monthly
                month: b.month_year.getMonth() + 1, // Kembalikan ke format 1-12
                year: b.month_year.getFullYear(),
                // Note: 'currentSpent' & 'status' biasanya dihitung terpisah via Transaction Aggregation, 
                // tapi untuk setup Budget dasar, ini cukup.
            };
        });
    }
}
//# sourceMappingURL=budget.service.js.map
