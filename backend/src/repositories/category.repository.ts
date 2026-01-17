import { PrismaClient, TransactionType } from '../generated';

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


    async create (data: { name: string; icon?: string | undefined; type: TransactionType; user_id: string }) {
        return await this.prisma.category.create({
            data: { 
                name: data.name,
                icon: data.icon ?? null ,
                type: data.type,
                user_id: data.user_id
            }
        })    
    
    }
}