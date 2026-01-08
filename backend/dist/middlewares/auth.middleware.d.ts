import type { Response, NextFunction } from 'express';
export declare class AuthMiddleware {
    handle: (req: any, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    authorize: (roles: string[]) => (req: any, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
}
//# sourceMappingURL=auth.middleware.d.ts.map