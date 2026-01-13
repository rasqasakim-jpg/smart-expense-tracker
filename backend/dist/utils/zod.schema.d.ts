import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    fullName: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const walletSchema: z.ZodObject<{
    name: z.ZodString;
    balance: z.ZodNumber;
    type: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=zod.schema.d.ts.map