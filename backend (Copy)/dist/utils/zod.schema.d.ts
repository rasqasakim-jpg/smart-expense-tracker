import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    fullName: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    fullName: string;
    password: string;
}, {
    email: string;
    fullName: string;
    password: string;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const walletSchema: z.ZodObject<{
    name: z.ZodString;
    balance: z.ZodNumber;
    type: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: string;
    balance: number;
}, {
    name: string;
    type: string;
    balance: number;
}>;
//# sourceMappingURL=zod.schema.d.ts.map