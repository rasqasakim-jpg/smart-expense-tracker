export class BudgetRepository {
    prisma;
    constructor(prismaClient) {
        this.prisma = prismaClient;
    }
    /**
     * Create or Update Budget
     * Menggunakan upsert agar atomik (thread-safe)
     */
    async upsertBudget(userId, amount, date, categoryId) {
        // Normalisasi tanggal ke tanggal 1 bulan tersebut (UTC agar aman dari timezone server)
        // Contoh: 2026-02-01 00:00:00 UTC
        const startOfMonth = new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
        return this.prisma.budget.upsert({
            where: {
                // Ini merujuk pada @@unique([user_id, category_id, month_year]) di schema
                user_id_category_id_month_year: {
                    user_id: userId,
                    category_id: categoryId, // Prisma butuh trik jika field nullable masuk ke unique constraint composite, tapi biasanya null bisa langsung
                    month_year: startOfMonth
                }
            },
            update: {
                monthly_limit: amount, // Jika ada, update limit-nya
            },
            create: {
                user_id: userId,
                category_id: categoryId,
                monthly_limit: amount,
                month_year: startOfMonth,
            },
        });
    }
    /**
     * Find All Budgets by Month
     * Mengambil semua budget user di bulan tertentu beserta info kategorinya
     */
    async findAllByMonth(userId, date) {
        const startOfMonth = new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
        return this.prisma.budget.findMany({
            where: {
                user_id: userId,
                month_year: startOfMonth
            },
            include: {
                category: true // Mengambil nama kategori
            },
            orderBy: {
                category_id: 'asc' // Sort biar rapi (Global budget biasanya null, akan di paling atas/bawah tergantung DB)
            }
        });
    }
}
//# sourceMappingURL=budget.repository.js.map