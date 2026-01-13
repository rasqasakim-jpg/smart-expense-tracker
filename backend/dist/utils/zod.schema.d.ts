import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    fullName: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    fullName: string;
}, {
    email: string;
    password: string;
    fullName: string;
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
    balance: number;
    type: string;
}, {
    name: string;
    balance: number;
    type: string;
}>;
//# sourceMappingURL=zod.schema.d.ts.map