import prisma from '../database';
import { AiRepository } from '../repositories/ai.repository';
import { TransactionRepository } from '../repositories/transaction.repository';
import { CategoryRepository } from '../repositories/category.repository';
// 👇 Import Repository Budget kamu
import { BudgetRepository } from '../repositories/budget.repository'; 
import { GeminiService } from './gemini.service';

export class AiService {
  private aiRepo: AiRepository;
  private transactionRepo: TransactionRepository;
  private categoryRepo: CategoryRepository;
  private budgetRepo: BudgetRepository; // 👈 Property baru
  private geminiService: GeminiService;

  constructor() {
    this.aiRepo = new AiRepository(prisma);
    this.transactionRepo = new TransactionRepository(prisma);
    this.categoryRepo = new CategoryRepository(prisma);
    this.budgetRepo = new BudgetRepository(prisma); // 👈 Inisialisasi
    this.geminiService = new GeminiService();
  }

  async getFinancialInsight(userId: string) {
    // 1. CEK CACHE (Nyalakan lagi nanti kalau sudah fix)
    // ==================================================
    const lastInsight = await this.aiRepo.findLatestByUserId(userId);
    if (lastInsight) {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      if (lastInsight.created_at > oneDayAgo) {
        return lastInsight;
      }
    }

    // 2. DATA PREPARATION
    // ===================
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // A. Hitung Transaksi (Income & Expense)
    const { totalIncome, totalExpense } = await this.transactionRepo.getMonthlyAggregates(
      userId,
      startOfMonth,
      endOfMonth
    );

    // B. Ambil Top Boros
    const topExpensesRaw = await this.transactionRepo.getTopExpenses(
      userId,
      startOfMonth,
      endOfMonth,
      3
    );

    const topCategories = await Promise.all(
      topExpensesRaw.map(async (item) => {
        const cat = await this.categoryRepo.findById(item.category_id);
        const amount = Number(item._sum.amount);
        return `${cat?.name || 'Lainnya'}: Rp ${amount.toLocaleString('id-ID')}`;
      })
    );

    // C. AMBIL BUDGET DARI DB (Dinamis pakai kode kamu) 👈 UPDATED
    // ============================================================
    // Kita cari budget bulan ini pakai method 'findByMonth' yang kamu punya
    const budgetData = await this.budgetRepo.findByMonth(userId, now);

    // Ambil angkanya. Kalau null (belum set), nilainya 0.
    let budgetLimit = budgetData ? Number(budgetData.monthly_limit) : 0;

    // Fallback: Kalau user belum set budget, atau budgetnya 0,
    // Kita anggap Budget ideal = Total Pemasukan.
    // (Supaya AI tidak menganggap user minus parah cuma gara-gara lupa set budget)
    if (budgetLimit === 0) {
        budgetLimit = Number(totalIncome) || 1000000; // Default 1jt kalau income juga nol
    }

    // 3. PANGGIL AI (Gemini)
    // ======================
    const aiResult = await this.geminiService.analyzeFinancialHealth({
      userName: "User", 
      totalIncome,
      totalExpense,
      budgetLimit, // Sekarang ini pakai data real dari DB!
      topCategories,
    });

    // 4. SIMPAN HASIL
    const savedData = await this.aiRepo.create({
      user_id: userId,
      score: aiResult.score,
      status: aiResult.status,
      message: aiResult.message,
      tips: aiResult.tips
    });

    return savedData;
  }
}