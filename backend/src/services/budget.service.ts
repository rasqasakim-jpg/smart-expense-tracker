import { BudgetRepository } from "../repositories/budget.repository";
import prisma from "../database";

export class BudgetService {
    private budgetRepo: BudgetRepository;

    constructor() {
        this.budgetRepo = new BudgetRepository(prisma);
    }

    async setMonthBudget(userId: string, amount: number) {
        if (amount < 0) throw new Error("Budget tidak boleh negatif");

        const today = new Date();
        return await this.budgetRepo.upsertBudget(userId, amount, today);   
    }

    async getCurrentBudget(useId: string) {
        const today = new Date();
        const budget = await this.budgetRepo.findByMonth(useId, today);

        return {
            limit: budget ? Number(budget.monthly_limit) : 0,
            month: today.getMonth() + 1,
            year: today.getFullYear()
        }
    }
}

