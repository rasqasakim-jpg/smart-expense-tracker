export declare class CategoryService {
    private categoryRepo;
    constructor();
    getCatagories(userId: string, type?: string): Promise<{
        name: string;
        id: number;
        user_id: string | null;
        created_at: Date;
        type: import("../generated").$Enums.TransactionType;
        deleted_at: Date | null;
        icon: string | null;
    }[]>;
    createCategory(userId: string, data: {
        name: string;
        type: string;
        icon?: string;
    }): Promise<{
        name: string;
        id: number;
        user_id: string | null;
        created_at: Date;
        type: import("../generated").$Enums.TransactionType;
        deleted_at: Date | null;
        icon: string | null;
    }>;
}
//# sourceMappingURL=category.service.d.ts.map