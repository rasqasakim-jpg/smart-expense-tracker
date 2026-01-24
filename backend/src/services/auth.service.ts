import prisma from '../database';
import jwt from 'jsonwebtoken';
import { hashPassword, comparePassword } from '../utils/hash';
import { ActivityLogService } from './activity-log.service';
import { ActivityAction } from '../types/activity.types';
// Import yang baru:
import { OtpRepository } from '../repositories/otp.repository';
import { MailService } from './mail.service';

export class AuthService {
    private activityLogService: ActivityLogService;
    private otpRepository: OtpRepository;
    private mailService: MailService;

    constructor() {
        this.activityLogService = new ActivityLogService();
        // Inject prisma client ke repository sesuai pola kamu
        this.otpRepository = new OtpRepository(prisma);
        this.mailService = new MailService();
    }

    async registerUser(data: any) {
        const { fullName, email, password } = data;

        if (!fullName || !email || !password) {
            throw new Error("Full name, email, and password are required");
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error("Email sudah terdaftar");
        }

        const cleanName = fullName.replace(/\s+/g, ' ').toLowerCase();
        const randomSuffix = Math.floor(100 + Math.random() * 900);
        const defaultUsername = `${cleanName}${randomSuffix}`;
        const hashedPassword = await hashPassword(password);

        const newUser = await prisma.user.create({
            data: {
                full_name: fullName,
                email,
                password: hashedPassword,
                role: 'USER',
                profile: { create: { username: defaultUsername } }
            },
            select: { id: true, email: true, full_name: true }
        });

        // --- LOGIC OTP SETELAH REGISTER ---
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Simpan ke database lewat repo
        await this.otpRepository.createOtp(newUser.id, otpCode, 'REGISTRATION');

        // Kirim email lewat service
        await this.mailService.sendOTP(newUser.email, otpCode);

        await this.activityLogService.log(
            newUser.id,
            ActivityAction.REGISTER,
            `User registered and OTP sent to: ${email}`
        );

        return newUser;
    }

    // Fungsi tambahan untuk verifikasi OTP saat user input kode di aplikasi
    async verifyRegistration(userId: string, code: string) {
        const isValid = await this.otpRepository.findValidOtp(userId, code);

        if (!isValid) {
            throw new Error("Kode OTP salah atau sudah kadaluarsa");
        }

        // Hapus OTP setelah berhasil diverifikasi
        await this.otpRepository.deleteUserOtps(userId);

        return { message: "Akun berhasil diverifikasi" };
    }



    async loginUser(data: any) {
        const { email, password } = data;

        // 1. Cek User
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new Error("Email atau password salah");
        }

        // 2. Cek Password
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Email atau password salah");
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET || 'super_secret_key',
            { expiresIn: '1d' }
        )

        await this.activityLogService.log(
            user.id,
            ActivityAction.LOGIN,
            "User logged in successfully"
        );

        return {
            accessToken: token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                role: user.role
            }
        };
    }

    async resendOtp(email: string) {
        // 1. Cek apakah user dengan email tersebut ada
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            throw new Error("Email tidak ditemukan");
        }

        // 2. Cek apakah user sudah terverifikasi (Opsional: kalau sudah verified ngapain minta OTP lagi?)
        // if (user.is_verified) {
        //     throw new Error("Akun ini sudah diverifikasi");
        // }

        // 3. Hapus OTP lama agar tidak menumpuk (PENTING)
        // Kita pakai fungsi yang sudah kamu buat di repository
        await this.otpRepository.deleteUserOtps(user.id);

        // 4. Generate kode baru
        const newOtpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // 5. Simpan kode baru ke database
        await this.otpRepository.createOtp(user.id, newOtpCode, 'REGISTRATION');

        // 6. Kirim email baru
        await this.mailService.sendOTP(user.email, newOtpCode);

        // 7. Catat log aktivitas (Opsional tapi bagus buat debugging)
        await this.activityLogService.log(
            user.id,
            ActivityAction.LOGIN, // Atau buat enum baru RESEND_OTP
            `OTP resent to: ${email}`
        );

        return { message: "Kode OTP baru berhasil dikirim" };
    }


}

