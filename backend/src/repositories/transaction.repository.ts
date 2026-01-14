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
  constructor(private prisma: PrismaClient) {}

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
}