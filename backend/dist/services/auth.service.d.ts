export declare class AuthService {
    registerUser(data: any): Promise<{
        id: string;
        full_name: string;
        email: string;
        profile: {
            username: string;
        } | null;
    }>;
    loginUser(data: any): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            fullName: string;
            role: import("../generated").$Enums.UserRole;
        };
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map