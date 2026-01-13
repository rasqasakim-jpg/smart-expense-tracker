import type { Request, Response } from "express";
export declare class TransactionController {
    private service;
    constructor();
    getAll: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getDetail: (req: Request, res: Response, next: import("express").NextFunction) => void;
    create: (req: Request, res: Response, next: import("express").NextFunction) => void;
    update: (req: Request, res: Response, next: import("express").NextFunction) => void;
    delete: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=transaction.controller.d.ts.map