export declare class UserService {
    updateProfile(userId: string, data: {
        fullName?: string;
        username?: string;
        address?: string;
        dateOfBirth?: string;
        occupation?: string;
    }): Promise<{
        id: string;
        full_name: string;
        email: string;
        profile: {
            id: string;
            user_id: string;
            username: string;
            address: string | null;
            date_of_birth: Date | null;
            occupation: string | null;
        } | null;
    }>;
}
//# sourceMappingURL=user.service.d.ts.map