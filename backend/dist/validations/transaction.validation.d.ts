import { z } from "zod";
export declare const createTransactionSchema: z.ZodObject<{
    wallet_id: z.ZodString;
    category_id: z.ZodNumber;
    name: z.ZodString;
    amount: z.ZodNumber;
    type: z.ZodNativeEnum<{
        INCOME: "INCOME";
        EXPENSE: "EXPENSE";
    }>;
    transaction_date: z.ZodString;
    note: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: "INCOME" | "EXPENSE";
    category_id: number;
    wallet_id: string;
    amount: number;
    transaction_date: string;
    note?: string | undefined;
}, {
    name: string;
    type: "INCOME" | "EXPENSE";
    category_id: number;
    wallet_id: string;
    amount: number;
    transaction_date: string;
    note?: string | undefined;
}>;
export declare const updateTransactionSchema: z.ZodObject<{
    wallet_id: z.ZodOptional<z.ZodString>;
    category_id: z.ZodOptional<z.ZodNumber>;
    name: z.ZodOptional<z.ZodString>;
    amount: z.ZodOptional<z.ZodNumber>;
    type: z.ZodOptional<z.ZodNativeEnum<{
        INCOME: "INCOME";
        EXPENSE: "EXPENSE";
    }>>;
    transaction_date: z.ZodOptional<z.ZodString>;
    note: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    type?: "INCOME" | "EXPENSE" | undefined;
    category_id?: number | undefined;
    wallet_id?: string | undefined;
    amount?: number | undefined;
    note?: string | undefined;
    transaction_date?: string | undefined;
}, {
    name?: string | undefined;
    type?: "INCOME" | "EXPENSE" | undefined;
    category_id?: number | undefined;
    wallet_id?: string | undefined;
    amount?: number | undefined;
    note?: string | undefined;
    transaction_date?: string | undefined;
}>;
export declare const queryTransactionSchema: z.ZodObject<{
    month: z.ZodOptional<z.ZodNumber>;
    year: z.ZodOptional<z.ZodNumber>;
    search: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodNativeEnum<{
        INCOME: "INCOME";
        EXPENSE: "EXPENSE";
    }>>;
}, "strip", z.ZodTypeAny, {
    search?: string | undefined;
    type?: "INCOME" | "EXPENSE" | undefined;
    year?: number | undefined;
    month?: number | undefined;
}, {
    search?: string | undefined;
    type?: "INCOME" | "EXPENSE" | undefined;
    year?: number | undefined;
    month?: number | undefined;
}>;
export type CreateTransactionDTO = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionDTO = z.infer<typeof updateTransactionSchema>;
export type QueryTransactionDTO = z.infer<typeof queryTransactionSchema>;
//# sourceMappingURL=transaction.validation.d.ts.map