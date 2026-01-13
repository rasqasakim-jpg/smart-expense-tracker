import { CategoryRepository } from "../repositories/category.repository.js";
import prisma from "../database.js"; // Import koneksi database singleton
import { TransactionType } from "../generated";
export class CategoryService {
    categoryRepo;
    constructor() {
        this.categoryRepo = new CategoryRepository(prisma);
    }
    async getCatagories(userId, type) {
        let typeEnum;
        if (type === "INCOME") {
            typeEnum = TransactionType.INCOME;
        }
        else if (type === "EXPANSE") {
            typeEnum = TransactionType.EXPENSE;
        }
        return await this.categoryRepo.findAll(userId, typeEnum);
    }
    async createCategory(userId, data) {
        if (!data.name || !data.type) {
            throw new Error("Nama kategori dan Tipe transaksi wajib diisi");
        }
        let transactionType;
        if (data.type === "INCOME") {
            transactionType = TransactionType.INCOME;
        }
        else if (data.type === "EXPANSE") {
            transactionType = TransactionType.EXPENSE;
        }
        else {
            throw new Error("Type harus INCOME atau EXPENSE");
        }
        return await this.categoryRepo.create({
            name: data.name,
            type: transactionType,
            icon: data.icon,
            user_id: userId
        });
    }
}
//# sourceMappingURL=category.service.js.map
