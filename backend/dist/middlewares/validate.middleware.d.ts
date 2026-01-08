import type { Request, Response, NextFunction } from "express";
import { ZodObject } from 'zod';
export declare const valided: (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=validate.middleware.d.ts.map