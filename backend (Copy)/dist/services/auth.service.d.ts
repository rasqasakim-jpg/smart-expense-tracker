export declare class AuthService {
    private activityLogService;
    private otpRepository;
    private mailService;
    constructor();
    /**
     * TAHAP 1: REQUEST REGISTER
     * Logic: Cek email, hash password, simpan data ke tabel OTP, kirim email.
     */
    registerUser(data: any): Promise<{
        message: string;
        email: any;
    }>;
    /**
     * TAHAP 2: VERIFY REGISTER (FINALISASI)
     * Logic: Cek OTP, ambil payload, create User & Profile secara atomik (Transaction).
     */
    verifyRegistration(email: string, code: string): Promise<{
        id: string;
        email: string;
        fullName: string;
    }>;
    loginUser(data: any): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            fullName: string;
            role: import("../../dist/generated/index.js").$Enums.UserRole;
        };
    }>;
    resendOtp(email: string): Promise<{
        message: string;
    }>;
    requestPasswordReset(email: string): Promise<{
        message: string;
    }>;
    resetPassword(data: any): Promise<{
        message: string;
    }>;
    changePassword(userId: string, data: any): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map
