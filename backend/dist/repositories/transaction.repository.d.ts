import { PrismaClient, Prisma, TransactionType } from "../generated";
export declare class TransactionRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    create(data: Prisma.TransactionCreateInput, tx?: Prisma.TransactionClient): Promise<{
        name: string;
        id: string;
        user_id: string;
        created_at: Date;
        type: import("../generated").$Enums.TransactionType;
        deleted_at: Date | null;
        category_id: number;
        wallet_id: string;
        amount: Prisma.Decimal;
        note: string | null;
        transaction_date: Date;
        updated_at: Date;
    }>;
    findAll(userId: string, filters: {
        startDate: Date;
        endDate: Date;
        type?: TransactionType;
        search?: string;
    }): Promise<({
        wallet: {
            name: string;
            id: string;
            user_id: string;
            created_at: Date;
            balance: Prisma.Decimal;
            type: string;
            deleted_at: Date | null;
        };
        category: {
            name: string;
            id: number;
            user_id: string | null;
            created_at: Date;
            type: import("../generated").$Enums.TransactionType;
            deleted_at: Date | null;
            icon: string | null;
        };
    } & {
        name: string;
        id: string;
        user_id: string;
        created_at: Date;
        type: import("../generated").$Enums.TransactionType;
        deleted_at: Date | null;
        category_id: number;
        wallet_id: string;
        amount: Prisma.Decimal;
        note: string | null;
        transaction_date: Date;
        updated_at: Date;
    })[]>;
    findById(id: string): Promise<({
        wallet: {
            name: string;
            id: string;
            user_id: string;
            created_at: Date;
            balance: Prisma.Decimal;
            type: string;
            deleted_at: Date | null;
        };
        category: {
            name: string;
            id: number;
            user_id: string | null;
            created_at: Date;
            type: import("../generated").$Enums.TransactionType;
            deleted_at: Date | null;
            icon: string | null;
        };
    } & {
        name: string;
        id: string;
        user_id: string;
        created_at: Date;
        type: import("../generated").$Enums.TransactionType;
        deleted_at: Date | null;
        category_id: number;
        wallet_id: string;
        amount: Prisma.Decimal;
        note: string | null;
        transaction_date: Date;
        updated_at: Date;
    }) | null>;
    update(id: string, data: Prisma.TransactionUpdateInput, tx?: Prisma.TransactionClient): Promise<{
        name: string;
        id: string;
        user_id: string;
        created_at: Date;
        type: import("../generated").$Enums.TransactionType;
        deleted_at: Date | null;
        category_id: number;
        wallet_id: string;
        amount: Prisma.Decimal;
        note: string | null;
        transaction_date: Date;
        updated_at: Date;
    }>;
    delete(id: string, tx?: Prisma.TransactionClient): Promise<{
        name: string;
        id: string;
        user_id: string;
        created_at: Date;
        type: import("../generated").$Enums.TransactionType;
        deleted_at: Date | null;
        category_id: number;
        wallet_id: string;
        amount: Prisma.Decimal;
        note: string | null;
        transaction_date: Date;
        updated_at: Date;
    }>;
}
//# sourceMappingURL=transaction.repository.d.ts.map