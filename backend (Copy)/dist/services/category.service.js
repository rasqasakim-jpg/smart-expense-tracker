import { CategoryRepository } from "../repositories/category.repository.js";
import prisma from "../database.js"; // Import koneksi database singleton
import { TransactionType, CategoryOption } from "../../dist/generated/index.js";
export class CategoryService {
    categoryRepo;
    constructor() {
        this.categoryRepo = new CategoryRepository(prisma);
    }
    async getCategories(userId, type) {
        let typeEnum;
        if (type === "INCOME") {
            typeEnum = TransactionType.INCOME;
        }
        else if (type === "EXPENSE") {
            typeEnum = TransactionType.EXPENSE;
        }
        return await this.categoryRepo.findAll(userId, typeEnum);
    }
    async createCategory(userId, data) {
        // 1. Validasi apakah 'name' yang dikirim user ada di enum CategoryOption
        if (!(data.name in CategoryOption)) {
            throw new Error(`Kategori ${data.name} tidak valid.`);
        }
        // 2. Mapping String ke Enum
        const categoryName = data.name;
        const transactionType = data.type === "INCOME" ? TransactionType.INCOME : TransactionType.EXPENSE;
        // 3. Logic: Jika user membuat kategori baru sendiri (custom), 
        // secara default biarkan mereka menggunakan yang sudah ada, 
        // tapi jika ini untuk input transaksi 'Other', logikanya ada di TransactionService.
        return await this.categoryRepo.create({
            name: categoryName,
            type: transactionType,
            user_id: userId
        });
    }
}
//# sourceMappingURL=category.service.js.map
