import { TransactionRepository } from "../repositories/transaction.repository";
import { WalletRepository } from "../repositories/wallet.repository";
import prisma from "../database";
import { TransactionType } from "../generated";


export class DashboardService {
    private transactionRepo: TransactionRepository;
    private walletRepo: WalletRepository;

    constructor() {
        this.transactionRepo = new TransactionRepository(prisma);
        this.walletRepo = new WalletRepository(prisma)
    }


    async getDashboardData(userId: string, month?: number, year?: number) {

        const now = new Date();
        const targetMonth = month ? month - 1 : now.getMonth();
        const targetYear = year || now.getFullYear();

        const startDate = new Date(targetYear, targetMonth, 1);
        const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

        const [summaryStats, dailyData, wallets, recentTransactions] = await Promise.all([

            this.transactionRepo.getSummaryStats(userId, startDate, endDate),

            this.transactionRepo.getDailyTransactions(userId, startDate, endDate),

            this.walletRepo.findAll(userId),

            this.transactionRepo.findAll(userId, {
                startDate,
                endDate,
                page: 1,
                limit: 5
            })
        ]);

        const totalRealBalance = wallets.reduce((acc, curr) => acc + Number(curr.balance), 0);

        let totalIncome = 0;
        let totalExpense = 0;
        summaryStats.forEach(stat => {
            const vall = Number(stat._sum.amount) || 0;
            if (stat.type === TransactionType.INCOME) totalIncome = vall;
            if (stat.type === TransactionType.EXPENSE) totalExpense = vall;
        })

        const chartMap = new Map<string, { income: number, expense: number }>();


        dailyData.forEach(trx => {
            const dateKey = trx.transaction_date.toISOString().split('T')[0] as string;
            const amount = Number(trx.amount);

            if (!chartMap.has(dateKey)) {
                chartMap.set(dateKey, { income: 0, expense: 0 });
            }

            const dayStat = chartMap.get(dateKey)!;

            if (trx.type === TransactionType.INCOME) dayStat.income += amount;
            else dayStat.expense += amount
        });

        const chartData = Array.from(chartMap.entries())
            .map(([date, val]) => ({ date, ...val }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getDate());


        return {
            summary: {
                total_balance: totalRealBalance,
                income: totalIncome,
                expense: totalExpense
            },
            chart: chartData,
            recent_transactions: recentTransactions.data
        }
    }
}