import { PrismaClient, WalletType } from "../../dist/generated/index.js";
export declare class WalletRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    findAll(userId: string): Promise<{
        created_at: Date;
        id: string;
        user_id: string;
        name: string;
        type: import("../../dist/generated/index.js").$Enums.WalletType;
        balance: import("@prisma/client-runtime-utils").Decimal;
        deleted_at: Date | null;
    }[]>;
    findById(id: string): Promise<{
        created_at: Date;
        id: string;
        user_id: string;
        name: string;
        type: import("../../dist/generated/index.js").$Enums.WalletType;
        balance: import("@prisma/client-runtime-utils").Decimal;
        deleted_at: Date | null;
    } | null>;
    create(data: {
        name: string;
        type: WalletType;
        balance: number;
        user_id: string;
    }): Promise<{
        created_at: Date;
        id: string;
        user_id: string;
        name: string;
        type: import("../../dist/generated/index.js").$Enums.WalletType;
        balance: import("@prisma/client-runtime-utils").Decimal;
        deleted_at: Date | null;
    }>;
    update(id: string, data: {
        name?: string;
        type?: WalletType;
        balance?: number;
    }): Promise<{
        created_at: Date;
        id: string;
        user_id: string;
        name: string;
        type: import("../../dist/generated/index.js").$Enums.WalletType;
        balance: import("@prisma/client-runtime-utils").Decimal;
        deleted_at: Date | null;
    }>;
    delete(id: string): Promise<{
        created_at: Date;
        id: string;
        user_id: string;
        name: string;
        type: import("../../dist/generated/index.js").$Enums.WalletType;
        balance: import("@prisma/client-runtime-utils").Decimal;
        deleted_at: Date | null;
    }>;
}
//# sourceMappingURL=wallet.repository.d.ts.map
