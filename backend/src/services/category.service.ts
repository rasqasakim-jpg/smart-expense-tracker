import { CategoryRepository } from '../repositories/category.repository';
import prisma from '../database'; // Import koneksi database singleton
import { TransactionType, CategoryOption } from '../generated';


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

    async createCategory(userId: string, data: { name: string; type: string }) {
        // 1. Validasi apakah 'name' yang dikirim user ada di enum CategoryOption
        if (!(data.name in CategoryOption)) {
            throw new Error(`Kategori ${data.name} tidak valid.`);
        }

        // 2. Mapping String ke Enum
        const categoryName = data.name as CategoryOption;
        const transactionType = data.type === 'INCOME' ? TransactionType.INCOME : TransactionType.EXPENSE;

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
