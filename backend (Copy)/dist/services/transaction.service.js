import { TransactionRepository } from "../repositories/transaction.repository.js";
import { WalletRepository } from "../repositories/wallet.repository.js";
import { BudgetRepository } from "../repositories/budget.repository.js";
import { NotificationService } from "./notification.service.js";
import { CategoryRepository } from "../repositories/category.repository.js";
import prisma from "../database.js";
import { TransactionType, CategoryOption } from "../../dist/generated/index.js";
export class TransactionService {
    transactionRepo;
    walletRepo;
    budgetRepo;
    notificationService;
    categoryRepo;
    constructor() {
        this.transactionRepo = new TransactionRepository(prisma);
        this.walletRepo = new WalletRepository(prisma);
        this.budgetRepo = new BudgetRepository(prisma);
        this.notificationService = new NotificationService();
        this.categoryRepo = new CategoryRepository(prisma);
    }
    async createTransaction(userId, data) {
        // 1. Cek Wallet
        const wallet = await this.walletRepo.findById(data.wallet_id);
        if (!wallet || wallet.user_id !== userId) {
            throw new Error("Wallet tidak ditemukan atau bukan milik anda");
        }
        // 2. Validasi Kategori "Other"
        const category = await this.categoryRepo.findById(data.category_id);
        if (!category)
            throw new Error("Kategori tidak ditemukan");
        if (category.name === CategoryOption.OTHER_EXPENSE || category.name === CategoryOption.OTHER_INCOME) {
            if (!data.note || data.note.trim() === "") {
                throw new Error("Untuk kategori 'Lainnya', catatan (note) wajib diisi sebagai keterangan.");
            }
        }
        // 3. Jalankan Transaksi Database
        const result = await prisma.$transaction(async (tx) => {
            const newTransaction = await this.transactionRepo.create({
                name: data.name,
                amount: data.amount,
                type: data.type,
                note: data.note ?? null,
                transaction_date: new Date(data.transaction_date),
                user_id: userId,
                wallet: { connect: { id: data.wallet_id } },
                category: { connect: { id: data.category_id } }
            }, tx);
            let newBalance = Number(wallet.balance);
            if (data.type === "INCOME") {
                newBalance += data.amount;
            }
            else {
                newBalance -= data.amount;
            }
            await tx.wallet.update({
                where: { id: data.wallet_id },
                data: { balance: newBalance }
            });
            return newTransaction;
        });
        // 4. Cek Budget (Jika Expense)
        // [FIX] Kirim category_id untuk pengecekan spesifik
        if (result.type === "EXPENSE") {
            await this.checkOverBudget(userId, result.transaction_date, data.category_id);
        }
        return result;
    }
    // --- HELPER PRIVATE: Cek Budget (FIXED & OPTIMIZED) ---
    async checkOverBudget(userId, transactionDate, categoryId) {
        try {
            // A. [FIX] Panggil method .findAllByMonth(), bukan this.budgetRepo()
            const budgets = await this.budgetRepo.findAllByMonth(userId, transactionDate);
            if (budgets.length === 0)
                return; // Tidak ada budget sama sekali
            // B. Tentukan Awal & Akhir Bulan
            const startOfMonth = new Date(transactionDate.getFullYear(), transactionDate.getMonth(), 1);
            const endOfMonth = new Date(transactionDate.getFullYear(), transactionDate.getMonth() + 1, 0);
            // C. Cari Budget yang Relevan (Kategori Spesifik vs Global)
            const categoryBudget = budgets.find(b => b.category_id === categoryId);
            const globalBudget = budgets.find(b => b.category_id === null);
            // D. LOGIC 1: Cek Budget Kategori (Prioritas Utama)
            if (categoryBudget) {
                // Hitung pengeluaran HANYA untuk kategori ini (Pakai param ke-4 yg kita buat di Repo)
                const totalCatExpense = await this.transactionRepo.sumExpenseByMonth(userId, startOfMonth, endOfMonth, categoryId);
                const limit = Number(categoryBudget.monthly_limit);
                if (totalCatExpense > limit) {
                    const percentage = Math.round((totalCatExpense / limit) * 100);
                    const catName = categoryBudget.category?.name || "Kategori ini";
                    await this.notificationService.sendAlert(userId, `⚠️ Budget ${catName} Jebol!`, `Pengeluaran ${catName} (Rp ${totalCatExpense.toLocaleString("id-ID")}) sudah ${percentage}% dari limit.`);
                    return; // Stop disini agar tidak spam (opsional)
                }
            }
            // E. LOGIC 2: Cek Global Budget (Backup Plan)
            if (globalBudget) {
                // Hitung TOTAL semua pengeluaran (Tanpa filter kategori)
                const totalAllExpense = await this.transactionRepo.sumExpenseByMonth(userId, startOfMonth, endOfMonth);
                const limit = Number(globalBudget.monthly_limit);
                if (totalAllExpense > limit) {
                    const percentage = Math.round((totalAllExpense / limit) * 100);
                    await this.notificationService.sendAlert(userId, "\uD83D\uDEA8 Global Budget Alert!", `Total pengeluaranmu (Rp ${totalAllExpense.toLocaleString("id-ID")}) sudah tembus ${percentage}% dari budget global.`);
                }
            }
        }
        catch (error) {
            console.error("[WARNING] Gagal mengecek budget:", error);
        }
    }
    async getTransactions(userId, month, year, type, search, page = 1, limit = 10) {
        const now = new Date();
        const targetMonth = month ? month - 1 : now.getMonth();
        const targetYear = year || now.getFullYear();
        const startDate = new Date(targetYear, targetMonth, 1);
        const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);
        let typeEnum;
        if (type === "INCOME")
            typeEnum = TransactionType.INCOME;
        else if (type === "EXPENSE")
            typeEnum = TransactionType.EXPENSE;
        const { data, total } = await this.transactionRepo.findAll(userId, {
            startDate,
            endDate,
            search,
            type: typeEnum,
            page,
            limit
        });
        return {
            data: data,
            meta: {
                page: page,
                limit: limit,
                total_items: total,
                total_pages: Math.ceil(total / limit)
            }
        };
    }
    async getTransactionDetail(userId, transactionId) {
        const transaction = await this.transactionRepo.findById(transactionId);
        if (!transaction)
            throw new Error("Transaksi tidak ditemukan");
        if (transaction.user_id !== userId)
            throw new Error("Akses ditolak");
        return transaction;
    }
    async updateTransaction(userId, transactionId, data) {
        const oldTransaction = await this.transactionRepo.findById(transactionId);
        if (!oldTransaction || oldTransaction.user_id !== userId) {
            throw new Error("Transaksi tidak ditemukan");
        }
        if (data.wallet_id && data.wallet_id !== oldTransaction.wallet_id) {
            throw new Error("Tidak dapat memindakan wallet saat update. silakan hapus dan buat baru.");
        }
        const result = await prisma.$transaction(async (tx) => {
            const wallet = await this.walletRepo.findById(oldTransaction.wallet_id);
            if (!wallet)
                throw new Error("Wallet tidak ditemukan");
            let currentBalance = Number(wallet.balance);
            // Revert saldo lama
            if (oldTransaction.type === "INCOME")
                currentBalance -= Number(oldTransaction.amount);
            else
                currentBalance += Number(oldTransaction.amount);
            const newAmount = data.amount !== undefined ? data.amount : Number(oldTransaction.amount);
            const newType = data.type !== undefined ? data.type : oldTransaction.type;
            // Apply saldo baru
            if (newType === "INCOME")
                currentBalance += newAmount;
            else
                currentBalance -= newAmount;
            // UPDATE WALLET
            await tx.wallet.update({
                where: { id: wallet.id },
                data: { balance: currentBalance }
            });
            // UPDATE TRANSAKSI
            const updateData = {
                name: data.name,
                amount: data.amount,
                type: data.type,
                note: data.note ?? null,
                transaction_date: data.transaction_date ? new Date(data.transaction_date) : undefined,
            };
            if (data.category_id) {
                updateData.category = { connect: { id: data.category_id } };
            }
            return await this.transactionRepo.update(transactionId, updateData, tx);
        });
        // Trigger cek budget setelah update
        if (result.type === "EXPENSE") {
            // [FIX] Gunakan ID kategori baru (jika diupdate) atau yang lama
            const catId = data.category_id ?? result.category_id;
            await this.checkOverBudget(userId, result.transaction_date, catId);
        }
        return result;
    }
    async deleteTransaction(userId, transactionId) {
        const transaction = await this.transactionRepo.findById(transactionId);
        if (!transaction || transaction.user_id !== userId)
            throw new Error("Transaksi tidak ditemukan");
        const wallet = await this.walletRepo.findById(transaction.wallet_id);
        if (!wallet)
            throw new Error("Wallet terkait tidak ditemukan");
        return await prisma.$transaction(async (tx) => {
            await this.transactionRepo.delete(transactionId, tx);
            let reverseBalance = Number(wallet.balance);
            const amount = Number(transaction.amount);
            if (transaction.type === "INCOME")
                reverseBalance -= amount;
            else
                reverseBalance += amount;
            await tx.wallet.update({
                where: { id: wallet.id },
                data: { balance: reverseBalance }
            });
            return { message: "Transaksi berhasil dihapus dan saldo dikembalikan" };
        });
    }
}
//# sourceMappingURL=transaction.service.js.map
