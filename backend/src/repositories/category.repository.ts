import { PrismaClient, TransactionType, CategoryOption } from '../generated';

export class CategoryRepository { 
    constructor(private prisma: PrismaClient) {}

    async findAll(userId: string, type?: TransactionType) {
        return await this.prisma.category.findMany({

            where: { 

                OR: [
                    { user_id: null },
                    { user_id: userId }
                ],

                ...(type && { type :type }),

                deleted_at: null
            },
            orderBy: { id: 'asc' }
        })
        
    }


  async create(data: { name: CategoryOption; type: TransactionType; user_id: string }) {
    return await this.prisma.category.create({
        data: { 
            name: data.name,
            type: data.type,
            user_id: data.user_id
        }
    });
}

    async findById(id: number) {
        return await this.prisma.category.findUnique({
            where: { id }
        });
    }
}