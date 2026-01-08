export declare class AuthService {
    registerUser(data: any): Promise<{
        id: string;
        full_name: string;
        email: string;
    }>;
    loginUser(data: any): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            fullName: string;
        };
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map