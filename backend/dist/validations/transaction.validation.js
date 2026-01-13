import { z } from "zod";
import { TransactionType } from "../generated"; // Sesuaikan path
// Schema untuk CREATE
export const createTransactionSchema = z.object({
    wallet_id: z.string().uuid({ message: "Format Wallet ID tidak valid" }),
    category_id: z.number({ invalid_type_error: "Category ID harus angka" }).int(),
    name: z.string().min(1, "Nama transaksi wajib diisi").max(100),
    amount: z.number({ invalid_type_error: "Amount harus angka" }).min(1, "Jumlah harus > 0"),
    type: z.nativeEnum(TransactionType, {
        errorMap: () => ({ message: "Tipe harus INCOME atau EXPENSE" })
    }),
    transaction_date: z.string().datetime({ message: "Format tanggal ISO 8601 tidak valid" }),
    note: z.string().optional(),
});
// Schema untuk UPDATE (Semua field jadi optional)
export const updateTransactionSchema = createTransactionSchema.partial();
// Schema untuk QUERY (Filter & Search)
export const queryTransactionSchema = z.object({
    month: z.coerce.number().min(1).max(12).optional(), // Convert string "10" -> number 10
    year: z.coerce.number().min(2020).max(2100).optional(),
    search: z.string().optional(),
    type: z.nativeEnum(TransactionType).optional(),
});
//# sourceMappingURL=transaction.validation.js.map