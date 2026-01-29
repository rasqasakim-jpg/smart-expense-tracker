import prisma from '../database';
import { AiRepository } from '../repositories/ai.repository';
import { TransactionRepository } from '../repositories/transaction.repository';
import { CategoryRepository } from '../repositories/category.repository';
import { BudgetRepository } from '../repositories/budget.repository';
import { GeminiService } from './gemini.service';

export class AiService {
  private aiRepo: AiRepository;
  private transactionRepo: TransactionRepository;
  private categoryRepo: CategoryRepository;
  private budgetRepo: BudgetRepository;
  private geminiService: GeminiService;

  constructor() {
    this.aiRepo = new AiRepository(prisma);
    this.transactionRepo = new TransactionRepository(prisma);
    this.categoryRepo = new CategoryRepository(prisma);
    this.budgetRepo = new BudgetRepository(prisma);
    this.geminiService = new GeminiService();
  }

  // =================================================================
  // [HELPER PRIVATE] Ambil Data Profile User
  // =================================================================
  private async getUserProfileData(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    return {
      name: user?.full_name || "User",
      occupation: user?.profile?.occupation || "Umum",
      relationship: user?.profile?.relationship || "SINGLE"
    };
  }

  // =================================================================
  // 1. FITUR INSIGHT (Analisa Bulanan)
  // =================================================================
  async getFinancialInsight(userId: string) {
    // 1. CEK CACHE
    const lastInsight = await this.aiRepo.findLatestByUserId(userId);
    if (lastInsight) {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      if (lastInsight.created_at > oneDayAgo) {
        return lastInsight;
      }
    }

    // 2. DATA PREPARATION
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // A. Data User
    const userProfile = await this.getUserProfileData(userId);

    // B. Transaksi Aggregate
    const { totalIncome, totalExpense } = await this.transactionRepo.getMonthlyAggregates(
      userId,
      startOfMonth,
      endOfMonth
    );

    // C. Top Boros
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

    // D. [UPDATED] Ambil Budget List & Sum Total Limit
    // Karena budget sekarang bisa banyak (per kategori), kita ambil semua
    const budgetList = await this.budgetRepo.findAllByMonth(userId, now);
    
    // Hitung Total Kapasitas Budget (Global + Semua Kategori)
    let totalBudgetLimit = 0;
    
    if (budgetList.length > 0) {
        totalBudgetLimit = budgetList.reduce((sum, item) => sum + Number(item.monthly_limit), 0);
    }

    // Fallback logic jika user belum set budget sama sekali
    if (totalBudgetLimit === 0) {
      // Asumsi default: Budget ideal = Total Pemasukan (jangan lebih besar pasak daripada tiang)
      totalBudgetLimit = Number(totalIncome) || 1000000; 
    }

    // 3. PANGGIL AI
    const aiResult = await this.geminiService.analyzeFinancialHealth({
      userName: userProfile.name,
      userOccupation: userProfile.occupation,
      userRelationship: userProfile.relationship,
      totalIncome,
      totalExpense,
      budgetLimit: totalBudgetLimit, // Kirim Total Akumulasi Budget
      topCategories,
    });

    // 4. SIMPAN HASIL
    return await this.aiRepo.create({
      user_id: userId,
      score: aiResult.score,
      status: aiResult.status,
      message: aiResult.message,
      tips: aiResult.tips
    });
  }

  // =================================================================
  // 2. FITUR CHATBOT
  // =================================================================
  async chatWithAi(userId: string, message: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const userProfile = await this.getUserProfileData(userId);

    const { totalIncome, totalExpense } = await this.transactionRepo.getMonthlyAggregates(
      userId,
      startOfMonth,
      endOfMonth
    );

    // [UPDATED] Hitung Sisa Budget Global/Akumulatif
    const budgetList = await this.budgetRepo.findAllByMonth(userId, now);
    const totalBudgetLimit = budgetList.reduce((sum, item) => sum + Number(item.monthly_limit), 0);
    
    // Logic sisa: Jika ada budget, kurangi budget. Jika tidak, kurangi income.
    const remainingBudget = totalBudgetLimit > 0
      ? totalBudgetLimit - totalExpense
      : totalIncome - totalExpense;

    const recentTransactions = await this.transactionRepo.findRecent(userId, 5);

    const transactionListText = recentTransactions.map(t =>
      `- ${t.type} Rp ${Number(t.amount).toLocaleString('id-ID')} (${t.category?.name || 'Lainnya'})`
    ).join('\n');

    const contextSummary = `
      FAKTA KEUANGAN USER:
      - Nama: ${userProfile.name}
      - Pekerjaan: ${userProfile.occupation}
      - Status: ${userProfile.relationship}
      - Pemasukan Bulan Ini: Rp ${totalIncome.toLocaleString('id-ID')}
      - Pengeluaran Bulan Ini: Rp ${totalExpense.toLocaleString('id-ID')}
      - Total Budget (Limit): Rp ${totalBudgetLimit.toLocaleString('id-ID')}
      - Sisa Dana (Safety): Rp ${remainingBudget.toLocaleString('id-ID')}
      
      5 TRANSAKSI TERAKHIR:
      ${transactionListText}
    `;

    return await this.geminiService.chatWithFinancialBot(
      contextSummary,
      message,
      userProfile.occupation,
      userProfile.relationship
    );
  }
}