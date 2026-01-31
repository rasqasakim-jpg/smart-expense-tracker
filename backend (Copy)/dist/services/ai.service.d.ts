export declare class AiService {
    private aiRepo;
    private transactionRepo;
    private categoryRepo;
    private budgetRepo;
    private geminiService;
    constructor();
    private getUserProfileData;
    getFinancialInsight(userId: string): Promise<{
        created_at: Date;
        id: string;
        user_id: string;
        message: string;
        status: string;
        score: number;
        tips: string[];
    }>;
    chatWithAi(userId: string, message: string): Promise<any>;
}
//# sourceMappingURL=ai.service.d.ts.map