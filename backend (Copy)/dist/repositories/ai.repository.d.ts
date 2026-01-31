import { PrismaClient } from "../../dist/generated/index.js";
export declare class AiRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    findLatestByUserId(userId: string): Promise<{
        created_at: Date;
        id: string;
        user_id: string;
        message: string;
        status: string;
        score: number;
        tips: string[];
    } | null>;
    create(data: {
        user_id: string;
        score: number;
        status: string;
        message: string;
        tips: string[];
    }): Promise<{
        created_at: Date;
        id: string;
        user_id: string;
        message: string;
        status: string;
        score: number;
        tips: string[];
    }>;
}
//# sourceMappingURL=ai.repository.d.ts.map
