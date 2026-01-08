import { z } from 'zod';
export const registerSchema = z.object({
    fullName: z.string().min(3, "Nama minimal 3 karekter"),
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter")
});
export const loginSchema = z.object({
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(1, "Pasword wajib diisi")
});
export const walletSchema = z.object({
    name: z.string().min(3, "Nama dompet minimal 3 karakter"),
    balance: z.number().min(0, "Saldo tidak boleh negatif"),
    type: z.string().min(1, "Tipe dompet wajib diisi")
});
//# sourceMappingURL=zod.schema.js.map