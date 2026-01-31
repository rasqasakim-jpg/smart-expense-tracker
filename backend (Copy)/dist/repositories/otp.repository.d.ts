import { PrismaClient, Otp } from "../../dist/generated/index.js";
export declare class OtpRepository {
    private prisma;
    constructor(prismaClient: PrismaClient);
    createRegistrationOtp(email: string, code: string, payload: any): Promise<Otp>;
    findValidRegistrationOtp(email: string, code: string): Promise<Otp | null>;
    deleteOtpsByEmail(email: string): Promise<import("../../dist/generated/index.js").Prisma.BatchPayload>;
    createOtpWithUserId(userId: string, email: string, code: string, type: any): Promise<Otp>;
}
//# sourceMappingURL=otp.repository.d.ts.map
