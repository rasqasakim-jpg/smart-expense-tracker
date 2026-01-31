export declare class CategoryService {
    private categoryRepo;
    constructor();
    getCategories(userId: string, type?: string): Promise<{
        created_at: Date;
        id: number;
        user_id: string | null;
        name: import("../../dist/generated/index.js").$Enums.CategoryOption;
        type: import("../../dist/generated/index.js").$Enums.TransactionType;
        deleted_at: Date | null;
    }[]>;
    createCategory(userId: string, data: {
        name: string;
        type: string;
    }): Promise<{
        created_at: Date;
        id: number;
        user_id: string | null;
        name: import("../../dist/generated/index.js").$Enums.CategoryOption;
        type: import("../../dist/generated/index.js").$Enums.TransactionType;
        deleted_at: Date | null;
    }>;
}
//# sourceMappingURL=category.service.d.ts.map
