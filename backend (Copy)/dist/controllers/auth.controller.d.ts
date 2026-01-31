import type { Request, Response } from 'express';
export declare class AuthController {
    private authService;
    constructor();
    register: (req: Request, res: Response, next: import("express").NextFunction) => void;
    verifyOtp: (req: Request, res: Response, next: import("express").NextFunction) => void;
    login: (req: Request, res: Response, next: import("express").NextFunction) => void;
    me: (req: Request, res: Response, next: import("express").NextFunction) => void;
    resendOtp: (req: Request, res: Response, next: import("express").NextFunction) => void;
    forgotPassword: (req: Request, res: Response, next: import("express").NextFunction) => void;
    resetPassword: (req: Request, res: Response, next: import("express").NextFunction) => void;
    changePassword: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=auth.controller.d.ts.map