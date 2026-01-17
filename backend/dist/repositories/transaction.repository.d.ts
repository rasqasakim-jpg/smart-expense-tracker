import { PrismaClient, Prisma, TransactionType } from "../generated";
export interface TransactionFindAllOptions {
    startDate: Date;
    endDate: Date;
    type?: TransactionType | undefined;
    search?: string | undefined;
    page: number;
    limit: number;
}
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
    findAll(userId: string, filters: TransactionFindAllOptions): Promise<{
        data: ({
            wallet: {
                name: string;
                id: string;
            };
            category: {
                name: string;
                id: number;
                type: import("../generated").$Enums.TransactionType;
                icon: string | null;
            };
            attachments: {
                id: string;
                created_at: Date;
                transaction_id: string;
                file_path: string;
                file_type: string;
            }[];
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
        })[];
        total: number;
    }>;
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
    getSummaryStats(userId: string, startDate: Date, endDate: Date): Promise<(Prisma.PickEnumerable<Prisma.TransactionGroupByOutputType, "type"[]> & {
        _sum: {
            amount: Prisma.Decimal | null;
        };
    })[]>;
    getDailyTransactions(useId: string, startDate: Date, endDate: Date): Promise<{
        type: import("../generated").$Enums.TransactionType;
        amount: Prisma.Decimal;
        transaction_date: Date;
    }[]>;
}
//# sourceMappingURL=transaction.repository.d.ts.map