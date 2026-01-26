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
  // [HELPER PRIVATE] Ambil Data Profile User (Pekerjaan & Status)
  // =================================================================
  private async getUserProfileData(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true } // Join ke tabel Profile
    });

    return {
      name: user?.full_name || "User",
      occupation: user?.profile?.occupation || "Umum",
      // Default ke "SINGLE" jika user belum set status
      relationship: user?.profile?.relationship || "SINGLE"
    };
  }

  // =================================================================
  // 1. FITUR INSIGHT (Analisa Bulanan)
  // =================================================================
  async getFinancialInsight(userId: string) {
    // 1. CEK CACHE (Nyalakan lagi nanti kalau sudah fix)
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

    // A. Ambil Data User Lengkap (Nama, Pekerjaan, Relationship) 👇
    const userProfile = await this.getUserProfileData(userId);

    // B. Hitung Transaksi (Income & Expense)
    const { totalIncome, totalExpense } = await this.transactionRepo.getMonthlyAggregates(
      userId,
      startOfMonth,
      endOfMonth
    );

    // C. Ambil Top Boros
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

    // D. Ambil Budget (Dinamis)
    const budgetData = await this.budgetRepo.findByMonth(userId, now);
    let budgetLimit = budgetData ? Number(budgetData.monthly_limit) : 0;

    // Fallback logic
    if (budgetLimit === 0) {
      budgetLimit = Number(totalIncome) || 1000000;
    }

    // 3. PANGGIL AI (Gemini) - Dengan Data Profile Lengkap 👇
    const aiResult = await this.geminiService.analyzeFinancialHealth({
      userName: userProfile.name,
      userOccupation: userProfile.occupation,     // Kirim Pekerjaan
      userRelationship: userProfile.relationship, // Kirim Status Hubungan
      totalIncome,
      totalExpense,
      budgetLimit,
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

  // =================================================================
  // 2. FITUR CHATBOT
  // =================================================================
  async chatWithAi(userId: string, message: string) {
    // 1. DATA PREPARATION
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // A. Ambil Data User (Pekerjaan & Status) 👇
    const userProfile = await this.getUserProfileData(userId);

    // B. Total Income & Expense
    const { totalIncome, totalExpense } = await this.transactionRepo.getMonthlyAggregates(
      userId,
      startOfMonth,
      endOfMonth
    );

    // C. Budget & Sisa
    const budgetData = await this.budgetRepo.findByMonth(userId, now);
    const budgetLimit = budgetData ? Number(budgetData.monthly_limit) : 0;
    const remainingBudget = budgetLimit > 0
      ? budgetLimit - totalExpense
      : totalIncome - totalExpense;

    // D. Transaksi Terakhir
    const recentTransactions = await this.transactionRepo.findRecent(userId, 5);

    // 2. RAKIT CONTEXT STRING
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
      - Sisa Budget: Rp ${remainingBudget.toLocaleString('id-ID')}
      
      5 TRANSAKSI TERAKHIR:
      ${transactionListText}
    `;

    // 3. KIRIM KE GEMINI CHAT - Sertakan Occupation & Relationship 👇
    const reply = await this.geminiService.chatWithFinancialBot(
      contextSummary,
      message,
      userProfile.occupation,
      userProfile.relationship
    );

    return reply;
  }
}