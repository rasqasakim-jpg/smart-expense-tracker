export declare class GeminiService {
    private model;
    constructor();
    analyzeFinancialHealth(data: {
        userName: string;
        userOccupation: string;
        userRelationship: string;
        totalIncome: number;
        totalExpense: number;
        budgetLimit: number;
        topCategories: string[];
    }): Promise<any>;
    chatWithFinancialBot(contextData: string, userQuestion: string, userOccupation: string, userRelationship: string): Promise<any>;
}
//# sourceMappingURL=gemini.service.d.ts.map