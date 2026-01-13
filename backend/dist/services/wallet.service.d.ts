export declare class WalletService {
    private walletRepo;
    constructor();
    getWallets(userId: string): Promise<{
        name: string;
        id: string;
        user_id: string;
        created_at: Date;
        balance: import("@prisma/client-runtime-utils").Decimal;
        type: string;
        deleted_at: Date | null;
    }[]>;
    createWallet(userId: string, data: {
        name: string;
        type: string;
        balance: number;
    }): Promise<{
        name: string;
        id: string;
        user_id: string;
        created_at: Date;
        balance: import("@prisma/client-runtime-utils").Decimal;
        type: string;
        deleted_at: Date | null;
    }>;
    updateWallet(userId: string, walletId: string, data: any): Promise<{
        name: string;
        id: string;
        user_id: string;
        created_at: Date;
        balance: import("@prisma/client-runtime-utils").Decimal;
        type: string;
        deleted_at: Date | null;
    }>;
    deleteWallet(userId: string, walletId: string): Promise<{
        name: string;
        id: string;
        user_id: string;
        created_at: Date;
        balance: import("@prisma/client-runtime-utils").Decimal;
        type: string;
        deleted_at: Date | null;
    }>;
}
//# sourceMappingURL=wallet.service.d.ts.map