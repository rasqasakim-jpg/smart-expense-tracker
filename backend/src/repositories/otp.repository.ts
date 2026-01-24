// src/repositories/otp.repository.ts
import { PrismaClient, Otp } from '../generated'; 

export class OtpRepository {
    private prisma: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prisma = prismaClient;
    }

    async createOtp(userId: string, code: string, type: any): Promise<Otp> {
        return await this.prisma.otp.create({
            data: {
                user_id: userId,
                code: code,
                type: type,
                expired_at: new Date(Date.now() + 5 * 60 * 1000) // 5 Menit
            }
        });
    }

    async findValidOtp(userId: string, code: string): Promise<Otp | null> {
        return await this.prisma.otp.findFirst({
            where: {
                user_id: userId,
                code: code,
                expired_at: { gt: new Date() }
            }
        });
    }

    async deleteUserOtps(userId: string) {
        return await this.prisma.otp.deleteMany({
            where: { user_id: userId }
        });
    }
}