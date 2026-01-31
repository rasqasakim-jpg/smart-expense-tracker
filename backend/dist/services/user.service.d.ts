import { RelationshipStatus } from "../../dist/generated/index.js";
export declare class UserService {
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        full_name: string;
        profile: {
            username: string;
            address: string | null;
            date_of_birth: Date | null;
            occupation: string | null;
            relationship: import("../../dist/generated/index.js").$Enums.RelationshipStatus;
            avatar: string | null;
        } | null;
        wallets: {
            created_at: Date;
            id: string;
            user_id: string;
            name: string;
            type: import("../../dist/generated/index.js").$Enums.WalletType;
            balance: import("@prisma/client-runtime-utils").Decimal;
            deleted_at: Date | null;
        }[];
    }>;
    updateProfile(userId: string, data: {
        fullName?: string;
        username?: string;
        address?: string;
        dateOfBirth?: string;
        occupation?: string;
        relationship?: RelationshipStatus;
        avatar?: string;
    }): Promise<{
        id: string;
        full_name: string;
        profile: {
            id: string;
            user_id: string;
            username: string;
            address: string | null;
            date_of_birth: Date | null;
            occupation: string | null;
            relationship: import("../../dist/generated/index.js").$Enums.RelationshipStatus;
            avatar: string | null;
        } | null;
    }>;
}
//# sourceMappingURL=user.service.d.ts.map
