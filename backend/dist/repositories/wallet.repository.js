import prisma from "../database.js";
export class WalletRepository {
    async findAll(userId) {
        return await prisma.wallet.findMany({
            where: {
                user_id: userId,
                deleted_at: null // Ambil yang belum dihapus saja
            },
            orderBy: { created_at: "desc" }
        });
    }
    async findById(id) {
        return await prisma.wallet.findFirst({
            where: {
                id,
                deleted_at: null
            }
        });
    }
    async create(data) {
        return await prisma.wallet.create({
            data
        });
    }
    async update(id, data) {
        return await prisma.wallet.update({
            where: { id },
            data
        });
    }
    async delete(id) {
        // Soft Delete: Isi tanggal hari ini ke deleted_at
        return await prisma.wallet.update({
            where: { id },
            data: {
                deleted_at: new Date()
            }
        });
    }
}
//# sourceMappingURL=wallet.repository.js.map
