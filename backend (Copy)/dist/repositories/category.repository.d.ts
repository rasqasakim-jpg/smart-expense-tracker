import { PrismaClient, TransactionType, CategoryOption } from "../../dist/generated/index.js";
export declare class CategoryRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    findAll(userId: string, type?: TransactionType): Promise<{
        created_at: Date;
        id: number;
        user_id: string | null;
        name: import("../../dist/generated/index.js").$Enums.CategoryOption;
        type: import("../../dist/generated/index.js").$Enums.TransactionType;
        deleted_at: Date | null;
    }[]>;
    create(data: {
        name: CategoryOption;
        type: TransactionType;
        user_id: string;
    }): Promise<{
        created_at: Date;
        id: number;
        user_id: string | null;
        name: import("../../dist/generated/index.js").$Enums.CategoryOption;
        type: import("../../dist/generated/index.js").$Enums.TransactionType;
        deleted_at: Date | null;
    }>;
    findById(id: number): Promise<{
        created_at: Date;
        id: number;
        user_id: string | null;
        name: import("../../dist/generated/index.js").$Enums.CategoryOption;
        type: import("../../dist/generated/index.js").$Enums.TransactionType;
        deleted_at: Date | null;
    } | null>;
}
//# sourceMappingURL=category.repository.d.ts.map
