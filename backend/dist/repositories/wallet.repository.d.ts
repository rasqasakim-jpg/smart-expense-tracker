export declare class WalletRepository {
    findAll(userId: string): Promise<{
        name: string;
        id: string;
        user_id: string;
        created_at: Date;
        balance: import("@prisma/client-runtime-utils").Decimal;
        type: string;
        deleted_at: Date | null;
    }[]>;
    findById(id: string): Promise<{
        name: string;
        id: string;
        user_id: string;
        created_at: Date;
        balance: import("@prisma/client-runtime-utils").Decimal;
        type: string;
        deleted_at: Date | null;
    } | null>;
    create(data: {
        name: string;
        type: string;
        balance: number;
        user_id: string;
    }): Promise<{
        name: string;
        id: string;
        user_id: string;
        created_at: Date;
        balance: import("@prisma/client-runtime-utils").Decimal;
        type: string;
        deleted_at: Date | null;
    }>;
    update(id: string, data: {
        name?: string;
        type?: string;
        balance?: number;
    }): Promise<{
        name: string;
        id: string;
        user_id: string;
        created_at: Date;
        balance: import("@prisma/client-runtime-utils").Decimal;
        type: string;
        deleted_at: Date | null;
    }>;
    delete(id: string): Promise<{
        name: string;
        id: string;
        user_id: string;
        created_at: Date;
        balance: import("@prisma/client-runtime-utils").Decimal;
        type: string;
        deleted_at: Date | null;
    }>;
}
//# sourceMappingURL=wallet.repository.d.ts.map