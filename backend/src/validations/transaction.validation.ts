import { z } from "zod";
import { TransactionType } from "../generated"; // Sesuaikan path

// Schema untuk CREATE (TIDAK BERUBAH)
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

// Schema untuk UPDATE (TIDAK BERUBAH)
export const updateTransactionSchema = createTransactionSchema.partial();

// Schema untuk QUERY (Filter & Search & Pagination)
export const queryTransactionSchema = z.object({
  month: z.coerce.number().min(1).max(12).optional(),
  year: z.coerce.number().min(2020).max(2100).optional(),
  search: z.string().optional(),
  type: z.nativeEnum(TransactionType).optional(),

  // --- INI BAGIAN YANG KITA LENGKAPI ---

  // Page: Minimal 1 (tidak ada halaman 0 atau minus)
  page: z.coerce.number().min(1).optional(),

  // Limit: Minimal 1, Maksimal 100 (Safety biar user iseng gak request 1 juta data)
  limit: z.coerce.number().min(1).max(100).optional(),
});

// Export Type (DTO)
export type CreateTransactionDTO = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionDTO = z.infer<typeof updateTransactionSchema>;
export type QueryTransactionDTO = z.infer<typeof queryTransactionSchema>;