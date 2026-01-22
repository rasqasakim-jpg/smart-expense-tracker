import { PrismaClient, Prisma, TransactionType } from "../generated";


export interface TransactionFindAllOptions {
  startDate: Date;
  endDate: Date;
  type?: TransactionType | undefined;
  search?: string | undefined;
  page: number;
  limit: number;
}




export class TransactionRepository {
  constructor(private prisma: PrismaClient) { }

  // Create dengan support transaction client (tx)
  async create(data: Prisma.TransactionCreateInput, tx?: Prisma.TransactionClient) {
    const client = tx || this.prisma;
    return await client.transaction.create({ data });
  }

  // Find All 

  async findAll(userId: string, filters: TransactionFindAllOptions) {
    const skip = (filters.page - 1) * filters.limit;

    const whereCondition: Prisma.TransactionWhereInput = {
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
            select: { id: true, name: true, icon: true, type: true }
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
  async findById(id: string) {
    return await this.prisma.transaction.findFirst({
      where: { id, deleted_at: null },
      include: { category: true, wallet: true }
    });
  }

  // Update Data
  async update(id: string, data: Prisma.TransactionUpdateInput, tx?: Prisma.TransactionClient) {
    const client = tx || this.prisma;
    return await client.transaction.update({
      where: { id },
      data
    });
  }

  // Soft Delete
  async delete(id: string, tx?: Prisma.TransactionClient) {
    const client = tx || this.prisma;
    return await client.transaction.update({
      where: { id },
      data: { deleted_at: new Date() }
    });
  }




  // Untuk mengambil total Income dan Expense dashboard

  async getSummaryStats(userId: string, startDate: Date, endDate: Date) {
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
  async getDailyTransactions(useId: string, startDate: Date, endDate: Date) {
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

async getMonthlyAggregates(userId: string, startDate: Date, endDate: Date) {
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
      if (agg.type === 'INCOME') totalIncome = amount;
      else if (agg.type === 'EXPENSE') totalExpense = amount;
    });

    return { totalIncome, totalExpense };
  }

  // 2. Ambil Top 3 Kategori Boros (Group By Category)
  async getTopExpenses(userId: string, startDate: Date, endDate: Date, limit: number = 3) {
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
}