export declare class DashboardService {
    private transactionRepo;
    private walletRepo;
    constructor();
    getDashboardData(userId: string, month?: number, year?: number): Promise<{
        summary: {
            total_balance: number;
            income: number;
            expense: number;
        };
        chart: {
            income: number;
            expense: number;
            date: string;
        }[];
        recent_transactionas: ({
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
            amount: import("@prisma/client-runtime-utils").Decimal;
            note: string | null;
            transaction_date: Date;
            updated_at: Date;
        })[];
    }>;
}
//# sourceMappingURL=dashboard.service.d.ts.map