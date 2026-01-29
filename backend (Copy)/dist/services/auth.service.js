import prisma from "../database.js";
import jwt from "jsonwebtoken";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { ActivityLogService } from "./activity-log.service.js";
import { ActivityAction } from "../types/activity.types.js";
import { OtpRepository } from "../repositories/otp.repository.js";
import { MailService } from "./mail.service.js";
export class AuthService {
    activityLogService;
    otpRepository;
    mailService;
    constructor() {
        this.activityLogService = new ActivityLogService();
        this.otpRepository = new OtpRepository(prisma);
        this.mailService = new MailService();
    }
    /**
     * TAHAP 1: REQUEST REGISTER
     * Logic: Cek email, hash password, simpan data ke tabel OTP, kirim email.
     */
    async registerUser(data) {
        const { fullName, email, password } = data;
        if (!fullName || !email || !password) {
            throw new Error("Full name, email, and password are required");
        }
        // 1. Cek apakah email sudah terdaftar di tabel User
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error("Email sudah terdaftar");
        }
        // 2. Hash password di awal supaya aman saat disimpan di payload OTP
        const hashedPassword = await hashPassword(password);
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        // 3. Bersihkan OTP lama untuk email ini & Simpan data registrasi sementara ke tabel OTP
        await this.otpRepository.deleteOtpsByEmail(email);
        await this.otpRepository.createRegistrationOtp(email, otpCode, {
            fullName,
            password: hashedPassword
        });
        // 4. Kirim email
        await this.mailService.sendOTP(email, otpCode);
        return {
            message: "OTP telah dikirim ke email anda. Silakan verifikasi untuk menyelesaikan registrasi.",
            email
        };
    }
    /**
     * TAHAP 2: VERIFY REGISTER (FINALISASI)
     * Logic: Cek OTP, ambil payload, create User & Profile secara atomik (Transaction).
     */
    async verifyRegistration(email, code) {
        // 1. Cari & Validasi OTP berdasarkan email
        const otpRecord = await this.otpRepository.findValidRegistrationOtp(email, code);
        if (!otpRecord) {
            throw new Error("Kode OTP salah atau sudah kadaluarsa");
        }
        const payload = otpRecord.payload;
        // 2. Eksekusi Create User menggunakan Prisma Transaction
        const newUser = await prisma.$transaction(async (tx) => {
            const cleanName = payload.fullName.replace(/\s+/g, " ").toLowerCase();
            const randomSuffix = Math.floor(100 + Math.random() * 900);
            const defaultUsername = `${cleanName}${randomSuffix}`;
            // Create User & Profile
            const user = await tx.user.create({
                data: {
                    full_name: payload.fullName,
                    email: otpRecord.email,
                    password: payload.password, // Password sudah ter-hash dari registerUser
                    role: "USER",
                    profile: { create: { username: defaultUsername } }
                }
            });
            // Hapus OTP pendaftaran setelah berhasil
            await tx.otp.delete({ where: { id: otpRecord.id } });
            return user;
        });
        // 3. Log Aktivitas
        await this.activityLogService.log(newUser.id, ActivityAction.REGISTER, `User account created and verified via email: ${email}`);
        return {
            id: newUser.id,
            email: newUser.email,
            fullName: newUser.full_name
        };
    }
    async loginUser(data) {
        const { email, password } = data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new Error("Email atau password salah");
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid)
            throw new Error("Email atau password salah");
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || "super_secret_key", { expiresIn: "1d" });
        await this.activityLogService.log(user.id, ActivityAction.LOGIN, "User logged in successfully");
        return {
            accessToken: token,
            user: { id: user.id, email: user.email, fullName: user.full_name, role: user.role }
        };
    }
    async resendOtp(email) {
        // Cek apakah email sudah jadi user (jika sudah, arahkan ke flow login)
        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists)
            throw new Error("Akun ini sudah aktif, silakan login.");
        // Cari record pendaftaran sementara
        const pendingOtp = await prisma.otp.findFirst({
            where: { email, type: "REGISTRATION" },
            orderBy: { expired_at: "desc" }
        });
        if (!pendingOtp)
            throw new Error("Data pendaftaran tidak ditemukan. Silakan register ulang.");
        const newOtpCode = Math.floor(100000 + Math.random() * 900000).toString();
        // Update OTP (Bersihkan yang lama, buat yang baru dengan payload yang sama)
        await this.otpRepository.deleteOtpsByEmail(email);
        await this.otpRepository.createRegistrationOtp(email, newOtpCode, pendingOtp.payload);
        await this.mailService.sendOTP(email, newOtpCode);
        return { message: "Kode OTP baru berhasil dikirim" };
    }
    async requestPasswordReset(email) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new Error("Email tidak ditemukan");
        await this.otpRepository.deleteOtpsByEmail(email);
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        // Gunakan userId untuk forgot password karena user-nya sudah ada
        await this.otpRepository.createOtpWithUserId(user.id, email, otpCode, "PASSWORD_RESET");
        await this.mailService.sendOTP(user.email, otpCode);
        await this.activityLogService.log(user.id, ActivityAction.FORGOT_PASSWORD, `Reset requested for: ${email}`);
        return { message: "Kode OTP reset password telah dikirim" };
    }
    async resetPassword(data) {
        const { email, code, newPassword, confirmPassword } = data;
        if (newPassword !== confirmPassword)
            throw new Error("Password tidak cocok");
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new Error("User tidak ditemukan");
        // Cek OTP khusus untuk reset password
        const isValidOtp = await prisma.otp.findFirst({
            where: {
                user_id: user.id,
                code: code,
                type: "PASSWORD_RESET",
                expired_at: { gt: new Date() }
            }
        });
        if (!isValidOtp)
            throw new Error("Kode OTP salah atau kadaluarsa");
        const hashedPassword = await hashPassword(newPassword);
        await prisma.$transaction([
            prisma.user.update({ where: { id: user.id }, data: { password: hashedPassword } }),
            prisma.otp.deleteMany({ where: { user_id: user.id } })
        ]);
        await this.activityLogService.log(user.id, ActivityAction.RESET_PASSWORD, "Password changed successfully");
        return { message: "Password berhasil diubah. Silakan login." };
    }
    async changePassword(userId, data) {
        const { oldPassword, newPassword, confirmPassword } = data; //
        if (newPassword !== confirmPassword) {
            throw new Error("Password baru dan konfirmasi tidak cocok");
        }
        // Cari user berdasarkan ID yang didapat dari token
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new Error("User tidak ditemukan");
        // Bandingkan password lama
        const isMatch = await comparePassword(oldPassword, user.password);
        if (!isMatch)
            throw new Error("Password lama salah");
        // Hash & Update
        const hashedPassword = await hashPassword(newPassword);
        // Update tanpa me-return seluruh object user (keamanan)
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });
        return { message: "Password updated successfully" };
    }
}
//# sourceMappingURL=auth.service.js.map
