import { PrismaClient, TransactionType } from '../generated';
export declare class CategoryRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    findAll(useId: string, type?: TransactionType): Promise<{
        name: string;
        id: number;
        user_id: string | null;
        created_at: Date;
        type: import("../generated").$Enums.TransactionType;
        deleted_at: Date | null;
        icon: string | null;
    }[]>;
    create(data: {
        name: string;
        icon?: string | undefined;
        type: TransactionType;
        user_id: string;
    }): Promise<{
        name: string;
        id: number;
        user_id: string | null;
        created_at: Date;
        type: import("../generated").$Enums.TransactionType;
        deleted_at: Date | null;
        icon: string | null;
    }>;
}
//# sourceMappingURL=category.repository.d.ts.map