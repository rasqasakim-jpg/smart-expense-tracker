import { TransactionRepository } from "../repositories/transaction.repository";
import { WalletRepository } from "../repositories/wallet.repository";
import { BudgetRepository } from "../repositories/budget.repository"; // <--- TAMBAHAN
import { NotificationService } from "./notification.service"; // <--- TAMBAHAN
import prisma from "../database";
import type { CreateTransactionDTO, UpdateTransactionDTO } from "../validations/transaction.validation"; 
import { TransactionType } from "../generated";

export class TransactionService {
    private transactionRepo: TransactionRepository;
    private walletRepo: WalletRepository;
    private budgetRepo: BudgetRepository;           // <--- Properti Baru
    private notificationService: NotificationService; // <--- Properti Baru

    constructor() {
        this.transactionRepo = new TransactionRepository(prisma);
        this.walletRepo = new WalletRepository(prisma);
        
        // Inisialisasi dependensi baru
        this.budgetRepo = new BudgetRepository(prisma);
        this.notificationService = new NotificationService(); 
    }

    async createTransaction(userId: string, data: CreateTransactionDTO) {
        const wallet = await this.walletRepo.findById(data.wallet_id);
        if (!wallet || wallet.user_id !== userId) {
            throw new Error("Wallet tidak ditemukan atau bukan milik anda");
        }

        // 1. Jalankan Transaksi Database (Create Transaction + Update Wallet)
        const result = await prisma.$transaction(async (tx) => {
            const newTransaction = await this.transactionRepo.create({
                name: data.name,
                amount: data.amount,
                type: data.type as TransactionType,
                note: data.note ?? null,
                transaction_date: new Date(data.transaction_date),
                user_id: userId,
                wallet: {
                    connect: { id: data.wallet_id }
                },
                category: {
                    connect: { id: data.category_id }
                }
            }, tx);

            let newBalance = Number(wallet.balance);
            if (data.type === "INCOME") {
                newBalance += data.amount;
            } else {
                newBalance -= data.amount;
            }

            await tx.wallet.update({
                where: { id: data.wallet_id },
                data: { balance: newBalance }
            });

            return newTransaction;
        });

        // 2. [LOGIC BARU] Cek Budget & Kirim Notifikasi (Fire and Forget)
        // Kita jalankan SETELAH transaksi sukses agar tidak memblokir proses
        if (result.type === "EXPENSE") {
            // Gunakan await jika ingin memastikan notif terkirim sebelum response
            await this.checkOverBudget(userId, result.transaction_date);
        }

        return result;
    }

    // --- HELPER PRIVATE: Cek Budget ---
    private async checkOverBudget(userId: string, transactionDate: Date) {
        try {
            // A. Ambil Budget Bulan Ini
            const budget = await this.budgetRepo.findByMonth(userId, transactionDate);
            if (!budget) return; // Kalau user gak set budget, skip

            // B. Hitung Total Pengeluaran Bulan Ini
            // (Pastikan TransactionRepository punya method sumExpenseByMonth,z 
            // jika belum ada, nanti kita buatkan, tapi biasanya pakai findAll juga bisa diakali)
            // Untuk performa terbaik, repository harus punya query aggregate sum.
            // Di sini saya pakai cara manual via findAll dulu kalau repo belum update:
            const startOfMonth = new Date(transactionDate.getFullYear(), transactionDate.getMonth(), 1);
            const endOfMonth = new Date(transactionDate.getFullYear(), transactionDate.getMonth() + 1, 0);
            
            const { data: expenses } = await this.transactionRepo.findAll(userId, {
                startDate: startOfMonth,
                endDate: endOfMonth,
                type: TransactionType.EXPENSE,
                page: 1,
                limit: 10000 // Ambil semua
            });

            // Hitung manual total (Best practice: pakai prisma aggregate di repo, tapi ini work)
            const totalExpense = expenses.reduce((sum, trx) => sum + Number(trx.amount), 0);
            
            const limit = Number(budget.monthly_limit);

            // C. Cek Kondisi
            if (totalExpense > limit) {
                const percentage = Math.round((totalExpense / limit) * 100);
                const title = "🚨 Over Budget Alert!";
                const message = `Waduh! Pengeluaranmu bulan ini (Rp ${totalExpense.toLocaleString()}) sudah tembus ${percentage}% dari budget (Rp ${limit.toLocaleString()}). Rem dikit dong!`;

                await this.notificationService.sendAlert(userId, title, message);
                console.log(`[NOTIF] Over budget alert sent to User ${userId}`);
            }

        } catch (error) {
            console.error("[WARNING] Gagal mengecek budget:", error);
            // Error di sini jangan sampai bikin transaksi gagal
        }
    }

    async getTransactions(
        userId: string,
        month?: number,
        year?: number,
        type?: string,
        search?: string,
        page: number = 1,
        limit: number = 10
    ) {
        const now = new Date();
        const targetMonth = month ? month - 1 : now.getMonth();
        const targetYear = year || now.getFullYear();

        const startDate = new Date(targetYear, targetMonth, 1);
        const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

        let typeEnum: TransactionType | undefined;
        if (type === 'INCOME') typeEnum = TransactionType.INCOME;
        else if (type === 'EXPENSE') typeEnum = TransactionType.EXPENSE;

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

    async getTransactionDetail(userId: string, transactionId: string) {
        const transaction = await this.transactionRepo.findById(transactionId);
        if (!transaction) throw new Error("Transaksi tidak ditemukan");
        if (transaction.user_id !== userId) throw new Error("Akses ditolak")

        return transaction;
    }

    async updateTransaction(userId: string, transactionId: string, data: UpdateTransactionDTO) {
        const oldTransaction = await this.transactionRepo.findById(transactionId);
        if (!oldTransaction || oldTransaction.user_id !== userId) {
            throw new Error("Transaksi tidak ditemukan");
        }

        if (data.wallet_id && data.wallet_id !== oldTransaction.wallet_id) {
            throw new Error("Tidak dapat memindakan wallet saat update. silakan hapus dan buat baru.");
        }

        const result = await prisma.$transaction(async (tx) => {
            const wallet = await this.walletRepo.findById(oldTransaction.wallet_id)
            if (!wallet) throw new Error("Wallet tidak ditemukan");

            let currentBalance = Number(wallet.balance);
            
            // Revert saldo lama
            if (oldTransaction.type === 'INCOME') currentBalance -= Number(oldTransaction.amount);
            else currentBalance += Number(oldTransaction.amount)

            const newAmount = data.amount !== undefined ? data.amount : Number(oldTransaction.amount);
            const newType = data.type !== undefined ? data.type : oldTransaction.type;
            
            // Apply saldo baru
            if (newType === 'INCOME') currentBalance += newAmount;
            else currentBalance -= newAmount

            // UPDATE WALLET
            await tx.wallet.update({
                where: { id: wallet.id },
                data: { balance: currentBalance }
            });

            // UPDATE TRANSAKSI
            const updateData: any = {
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

        // Trigger cek budget lagi setelah update (optional, tapi bagus ada)
        if (result.type === "EXPENSE") {
             await this.checkOverBudget(userId, result.transaction_date);
        }
        
        return result;
    }

    async deleteTransaction(userId: string, transactionId: string) {
        const transaction = await this.transactionRepo.findById(transactionId);
        if (!transaction || transaction.user_id !== userId) throw new Error("Transaksi tidak ditemukan");

        const wallet = await this.walletRepo.findById(transaction.wallet_id);
        if (!wallet) throw new Error("Wallet terkait tidak ditemukan");

        return await prisma.$transaction(async (tx) => {
            await this.transactionRepo.delete(transactionId, tx);

            //Kembalikan Saldo (Reverse Logic)
            let reverseBalance = Number(wallet.balance);
            const amount = Number(transaction.amount);

            if (transaction.type === "INCOME") reverseBalance -= amount;
            else reverseBalance += amount;

            await tx.wallet.update({
                where: { id: wallet.id },
                data: { balance: reverseBalance }
            });
            return { message: "Transaksi berhasil dihapus dan saldo dikembalikan" }
        });
    }
}