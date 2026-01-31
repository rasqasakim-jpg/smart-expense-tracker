export declare class WalletService {
    private walletRepo;
    constructor();
    getWallets(userId: string): Promise<{
        created_at: Date;
        id: string;
        user_id: string;
        name: string;
        type: import("../../dist/generated/index.js").$Enums.WalletType;
        balance: import("@prisma/client-runtime-utils").Decimal;
        deleted_at: Date | null;
    }[]>;
    createWallet(userId: string, data: {
        name: string;
        type: string;
        balance: number;
    }): Promise<{
        created_at: Date;
        id: string;
        user_id: string;
        name: string;
        type: import("../../dist/generated/index.js").$Enums.WalletType;
        balance: import("@prisma/client-runtime-utils").Decimal;
        deleted_at: Date | null;
    }>;
    updateWallet(userId: string, walletId: string, data: {
        name?: string;
        type?: string;
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
    deleteWallet(userId: string, walletId: string): Promise<{
        created_at: Date;
        id: string;
        user_id: string;
        name: string;
        type: import("../../dist/generated/index.js").$Enums.WalletType;
        balance: import("@prisma/client-runtime-utils").Decimal;
        deleted_at: Date | null;
    }>;
}
//# sourceMappingURL=wallet.service.d.ts.map
