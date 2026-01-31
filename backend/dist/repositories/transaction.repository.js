export class TransactionRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    // Create dengan support transaction client (tx)
    async create(data, tx) {
        const client = tx || this.prisma;
        return await client.transaction.create({ data });
    }
    // Find All 
    async findAll(userId, filters) {
        const skip = (filters.page - 1) * filters.limit;
        const whereCondition = {
            user_id: userId,
            deleted_at: null,
            transaction_date: {
                gte: filters.startDate,
                lte: filters.endDate
            },
            ...(filters.type && { type: filters.type }),
        };
        if (filters.search) {
            whereCondition.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { note: { contains: filters.search, mode: 'insensitive' } }
            ];
        }
        // --- PERUBAHAN DI SINI ---
        // GANTI: this.prisma.$transaction([...])
        // JADI: Promise.all([...])
        const [transactions, total] = await Promise.all([
            this.prisma.transaction.findMany({
                where: whereCondition,
                include: {
                    category: {
                        select: { id: true, name: true, type: true }
                    },
                    wallet: {
                        select: { id: true, name: true }
                    },
                    attachments: true
                },
                orderBy: { transaction_date: "desc" },
                skip: skip,
                take: filters.limit,
            }),
            this.prisma.transaction.count({ where: whereCondition })
        ]);
        // -------------------------
        return { data: transactions, total };
    }
    // Find One by ID
    async findById(id) {
        return await this.prisma.transaction.findFirst({
            where: { id, deleted_at: null },
            include: { category: true, wallet: true }
        });
    }
    // Update Data
    async update(id, data, tx) {
        const client = tx || this.prisma;
        return await client.transaction.update({
            where: { id },
            data
        });
    }
    // Soft Delete
    async delete(id, tx) {
        const client = tx || this.prisma;
        return await client.transaction.update({
            where: { id },
            data: { deleted_at: new Date() }
        });
    }
    // Untuk mengambil total Income dan Expense dashboard
    async getSummaryStats(userId, startDate, endDate) {
        return await this.prisma.transaction.groupBy({
            by: ['type'],
            where: {
                user_id: userId,
                deleted_at: null,
                transaction_date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            _sum: {
                amount: true,
            },
        });
    }
    // [BARU] Untuk mengambil data mentah buat Grafik
    async getDailyTransactions(useId, startDate, endDate) {
        return await this.prisma.transaction.findMany({
            where: {
                user_id: useId,
                deleted_at: null,
                transaction_date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                transaction_date: true,
                amount: true,
                type: true,
            },
            orderBy: {
                transaction_date: 'asc'
            },
        });
    }
    // ==========================================
    // 👇 TAMBAHAN KHUSUS UNTUK AI INSIGHT 👇
    // ==========================================
    async getMonthlyAggregates(userId, startDate, endDate) {
        const aggregates = await this.prisma.transaction.groupBy({
            by: ['type'],
            where: {
                user_id: userId,
                deleted_at: null,
                transaction_date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            _sum: { amount: true },
        });
        let totalIncome = 0;
        let totalExpense = 0;
        aggregates.forEach((agg) => {
            // Kita pastikan konversi ke Number agar aman
            const amount = Number(agg._sum.amount || 0);
            if (agg.type === 'INCOME')
                totalIncome = amount;
            else if (agg.type === 'EXPENSE')
                totalExpense = amount;
        });
        return { totalIncome, totalExpense };
    }
    // 2. Ambil Top 3 Kategori Boros (Group By Category)
    async getTopExpenses(userId, startDate, endDate, limit = 3) {
        return await this.prisma.transaction.groupBy({
            by: ['category_id'],
            where: {
                user_id: userId,
                deleted_at: null,
                type: 'EXPENSE', // Cuma ambil pengeluaran
                transaction_date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            _sum: { amount: true },
            orderBy: {
                _sum: { amount: 'desc' }, // Urutkan dari yang paling gede
            },
            take: limit, // Ambil 3 teratas
        });
    }
    async sumExpenseByMonth(userId, startDate, endDate, categoryId) {
        // Siapkan filter dasar
        const whereClause = {
            user_id: userId,
            type: 'EXPENSE',
            deleted_at: null,
            transaction_date: {
                gte: startDate,
                lte: endDate
            }
        };
        // Jika ada categoryId, filter lebih spesifik
        if (categoryId) {
            whereClause.category_id = categoryId;
        }
        const result = await this.prisma.transaction.aggregate({
            where: whereClause,
            _sum: {
                amount: true
            }
        });
        // Jika null (belum ada transaksi), kembalikan 0
        return Number(result._sum.amount || 0);
    }
    async findRecent(userId, limit) {
        return await this.prisma.transaction.findMany({
            where: {
                user_id: userId,
                deleted_at: null,
            },
            orderBy: {
                transaction_date: "desc",
            },
            take: limit,
            include: {
                category: true
            },
        });
    }
}
//# sourceMappingURL=transaction.repository.js.map