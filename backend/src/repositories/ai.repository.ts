import { PrismaClient } from "../generated";

export class AiRepository {
    constructor(private prisma: PrismaClient) { }

    async findLatestByUserId(userId: string) {
        return await this.prisma.financialInsight.findFirst({
            where: { user_id: userId },
            orderBy: { created_at: 'desc' }
        });
    }

    async create(data: {
    user_id: string;
    score: number;
    status: string;
    message: string;
    tips: string[];
  }) {
    return await this.prisma.financialInsight.create({
      data: {
        user_id: data.user_id,
        score: data.score,
        status: data.status,
        message: data.message,
        tips: data.tips,
      },
    });
  }
}

