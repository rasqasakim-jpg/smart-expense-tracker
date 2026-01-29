import type { Request, Response } from 'express';
import { BudgetService } from '../services/budget.service';
import { asyncHandler } from '../utils/asyncHandler'; // Pastikan path utility benar

export class BudgetController {
  private budgetService: BudgetService;

  constructor() {
    this.budgetService = new BudgetService();
  }

  // POST /budget
  public setBudget = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    // Ambil data dari Frontend (biasanya JSON camelCase)
    const { amount, categoryId, month, year } = req.body;

    // Validasi Amount
    if (amount === undefined || amount === null || isNaN(Number(amount))) {
      throw new Error("Amount harus berupa angka valid");
    }

    // Default ke bulan/tahun sekarang jika FE tidak mengirim (fallback mechanism)
    const now = new Date();
    const targetMonth = month ? Number(month) : now.getMonth() + 1;
    const targetYear = year ? Number(year) : now.getFullYear();

    // Validasi CategoryId: pastikan jadi number atau undefined
    const categoryIdNum = categoryId ? Number(categoryId) : undefined;

    const result = await this.budgetService.setMonthBudget(
      userId, 
      Number(amount), 
      targetMonth, 
      targetYear, 
      categoryIdNum
    );

    res.status(200).json({
      success: true,
      message: categoryIdNum ? "Category Budget berhasil diset" : "Global Budget berhasil diset",
      data: result
    });
  });

  // GET /budget?month=1&year=2026
  public getBudgets = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    // Ambil filter dari Query Params
    const { month, year } = req.query;

    const now = new Date();
    // Jika tidak ada query params, default ke bulan ini
    const targetMonth = month ? Number(month) : now.getMonth() + 1;
    const targetYear = year ? Number(year) : now.getFullYear();

    const data = await this.budgetService.getBudgetList(userId, targetMonth, targetYear);

    res.status(200).json({
      success: true,
      message: "List Budget berhasil diambil",
      data: data 
    });
  });
}