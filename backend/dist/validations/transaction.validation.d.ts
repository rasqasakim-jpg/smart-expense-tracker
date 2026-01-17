import { z } from "zod";
export declare const createTransactionSchema: z.ZodObject<{
    wallet_id: z.ZodString;
    category_id: z.ZodNumber;
    name: z.ZodString;
    amount: z.ZodNumber;
    type: z.ZodEnum<{
        INCOME: "INCOME";
        EXPENSE: "EXPENSE";
    }>;
    transaction_date: z.ZodString;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateTransactionSchema: z.ZodObject<{
    wallet_id: z.ZodOptional<z.ZodString>;
    category_id: z.ZodOptional<z.ZodNumber>;
    name: z.ZodOptional<z.ZodString>;
    amount: z.ZodOptional<z.ZodNumber>;
    type: z.ZodOptional<z.ZodEnum<{
        INCOME: "INCOME";
        EXPENSE: "EXPENSE";
    }>>;
    transaction_date: z.ZodOptional<z.ZodString>;
    note: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const queryTransactionSchema: z.ZodObject<{
    month: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    year: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    search: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<{
        INCOME: "INCOME";
        EXPENSE: "EXPENSE";
    }>>;
    page: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type CreateTransactionDTO = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionDTO = z.infer<typeof updateTransactionSchema>;
export type QueryTransactionDTO = z.infer<typeof queryTransactionSchema>;
//# sourceMappingURL=transaction.validation.d.ts.map