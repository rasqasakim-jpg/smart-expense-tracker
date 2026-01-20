import type { Request, Response } from 'express';
import { BudgetService } from '../services/budget.service';
import { asyncHandler } from '../utils/asyncHandler';

export class BudgetController {
  private budgetService: BudgetService;

  constructor() {
    this.budgetService = new BudgetService();
  }
  // Set Budget (Upsert)
  public setBudget = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const { amount } = req.body;

    // Validasi input sederhana
    if (!amount || isNaN(Number(amount))) {
        throw new Error("Amount harus berupa angka valid");
    }

    const result = await this.budgetService.setMonthBudget(userId, Number(amount));

    res.status(200).json({
      success: true,
      message: "Budget berhasil diset",
      data: result
    });
  });

  // Get Current Budget
  public getBudget = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const data = await this.budgetService.getCurrentBudget(userId);

    res.status(200).json({
      success: true,
      message: "Operation success",
      data: data
    });
  });
}