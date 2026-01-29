// src/repositories/otp.repository.ts
import { PrismaClient, Otp } from '../../dist/generated'; 

export class OtpRepository {
    private prisma: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prisma = prismaClient;
    }

    // Untuk Registrasi (Belum ada userId)
    async createRegistrationOtp(email: string, code: string, payload: any): Promise<Otp> {
        return await this.prisma.otp.create({
            data: {
                email: email,
                code: code,
                type: 'REGISTRATION',
                payload: payload, // Menyimpan data user yang akan di-create
                expired_at: new Date(Date.now() + 5 * 60 * 1000) // 5 Menit
            }
        });
    }

    // Mencari OTP pendaftaran yang masih valid
    async findValidRegistrationOtp(email: string, code: string): Promise<Otp | null> {
        return await this.prisma.otp.findFirst({
            where: {
                email: email,
                code: code,
                type: 'REGISTRATION',
                expired_at: { gt: new Date() }
            }
        });
    }

    // Hapus semua OTP lama berdasarkan email (untuk resend)
    async deleteOtpsByEmail(email: string) {
        return await this.prisma.otp.deleteMany({
            where: { email: email }
        });
    }

    // --- Tetap pertahankan yang lama untuk flow Forgot Password (jika sudah ada User) ---
    async createOtpWithUserId(userId: string, email: string, code: string, type: any): Promise<Otp> {
        return await this.prisma.otp.create({
            data: {
                user_id: userId,
                email: email,
                code: code,
                type: type,
                expired_at: new Date(Date.now() + 5 * 60 * 1000)
            }
        });
    }
}