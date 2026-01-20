import { CategoryRepository } from '../repositories/category.repository';
import prisma from '../database'; // Import koneksi database singleton
import { TransactionType } from '../generated';


export class CategoryService {
    private categoryRepo: CategoryRepository;

    constructor() {
        this.categoryRepo = new CategoryRepository(prisma)
    }
 
    async getCategories(userId: string, type?: string) {
        let typeEnum: TransactionType | undefined;

        if (type === 'INCOME') {
            typeEnum = TransactionType.INCOME;
        } else if (type === 'EXPENSE') {
            typeEnum = TransactionType.EXPENSE
        }


        return await this.categoryRepo.findAll(userId, typeEnum);
    }

    async createCategory(userId: string, data: { name: string; type: string; icon?: string }) {
        if (!data.name || !data.type) {
            throw new Error("Nama kategori dan Tipe transaksi wajib diisi");
        }

        let transactionType: TransactionType;

        if (data.type === 'INCOME') {
            transactionType = TransactionType.INCOME;
        } else if (data.type === "EXPENSE") {
            transactionType = TransactionType.EXPENSE;
        } else {
            throw new Error("Type harus INCOME atau EXPENSE");
        }


        return await this.categoryRepo.create({
            name: data.name,
            type: transactionType,
            icon: data.icon,
            user_id: userId
        })
    }
}