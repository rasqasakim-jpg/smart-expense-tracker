import { TransactionRepository } from "../repositories/transaction.repository";
import { WalletRepository } from "../repositories/wallet.repository";
import prisma from "../database";
import type { CreateTransactionDTO, UpdateTransactionDTO } from "../validations/transaction.validation"; // Pakai tipe dari Zod
import { TransactionType } from "../generated";

export class TransactionService {
    private transactionRepo: TransactionRepository;
    private walletRepo: WalletRepository;

    constructor() {
        this.transactionRepo = new TransactionRepository(prisma);
        this.walletRepo = new WalletRepository(prisma);
    }

    async createTransaction(userId: string, data: CreateTransactionDTO) {
        const wallet = await this.walletRepo.findById(data.wallet_id);
        if (!wallet || wallet.user_id !== userId) {
            throw new Error("Wallet tidak dimukan atau bukan milik anda");
        }

        return await prisma.$transaction(async (tx) => {
            const newTransaction = await this.transactionRepo.create({
                name: data.name,
                amount: data.amount,
                type: data.type as TransactionType,
                note: data.note ?? null,
                transaction_date: new Date(data.transaction_date),
                user_id: userId,
                wallet: {
                    connect: { id: data.wallet_id }
                },
                category: {
                    connect: { id: data.category_id }
                }
            }, tx);

            let newBalace = Number(wallet.balance);
            if (data.type === "INCOME") {
                newBalace += data.amount;
            } else {
                newBalace -= data.amount;
            }

            await tx.wallet.update({
                where: { id: data.wallet_id },
                data: { balance: newBalace }
            });

            return newTransaction;
        });
    }


    async getTransactions(
        userId: string,
        month?: number,
        year?: number,
        type?: string,
        search?: string,
        page: number = 1,
        limit: number = 10
    ) {
        const now = new Date();
        const targetMonth = month ? month - 1 : now.getMonth();
        const targetYear = year || now.getFullYear();

        const startDate = new Date(targetYear, targetMonth, 1);
        const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

        let typeEnum: TransactionType | undefined;
        if (type === 'INCOME') typeEnum = TransactionType.INCOME;
        else if (type === 'EXPENSE') typeEnum = TransactionType.EXPENSE;

        const { data, total } = await this.transactionRepo.findAll(userId, {
            startDate,
            endDate,
            search,
            type: typeEnum,
            page,
            limit
        });

        return {
            data: data,
            meta: {
                page: page,
                limit: limit,
                total_items: total,
                total_pages: Math.ceil(total / limit)
            }
        };
    }


    async getTransactionDetail(userId: string, transactionId: string) {
        const transaction = await this.transactionRepo.findById(transactionId);
        if (!transaction) throw new Error("Transaksi tidak dimuka");
        if (transaction.user_id !== userId) throw new Error("Akses ditolak")

        return transaction;
    }


    async updateTransaction(userId: string, transactionId: string, data: UpdateTransactionDTO) {
        const oldTransaction = await this.transactionRepo.findById(transactionId);
        if (!oldTransaction || oldTransaction.user_id !== userId) {
            throw new Error("Transaksi tidak ditemukan");
        }

        if (data.wallet_id && data.wallet_id !== oldTransaction.wallet_id) {
            throw new Error("Tidak dapat memindakan wallet saat update. silakan hapus dan buat baru.");
        }

        return await prisma.$transaction(async (tx) => {
            const wallet = await this.walletRepo.findById(oldTransaction.wallet_id)
            if (!wallet) throw new Error("Wallet tidak dimukan");

            let currentBalance = Number(wallet.balance);
            if (oldTransaction.type === 'INCOME') currentBalance -= Number(oldTransaction.amount);
            else currentBalance += Number(oldTransaction.amount)

            const newAmount = data.amount !== undefined ? data.amount : Number(oldTransaction.amount);
            const newType = data.type !== undefined ? data.type : oldTransaction.type;
            if (newType === 'INCOME') currentBalance += newAmount;
            else currentBalance -= newAmount


            // UPDATE WALLET
            await tx.wallet.update({
                where: { id: wallet.id },
                data: { balance: currentBalance }
            });

            // UPDATE TRANSAKSI
            const updateData: any = {
                name: data.name,
                amount: data.amount,
                type: data.type,
                note: data.note ?? null,
                transaction_date: data.transaction_date ? new Date(data.transaction_date) : undefined,
            };
            if (data.category_id) {
                updateData.category = { connect: { id: data.category_id } };
            }

            return await this.transactionRepo.update(transactionId, updateData, tx);
        });

    }


    async deleteTransaction(userId: string, transactionId: string) {
        const transaction = await this.transactionRepo.findById(transactionId);
        if (!transaction || transaction.user_id !== userId) throw new Error("Transaksi tidak dimukan");

        const wallet = await this.walletRepo.findById(transaction.wallet_id);
        if (!wallet) throw new Error("Wallet terkait tidak ditemukan");

        return await prisma.$transaction(async (tx) => {
            await this.transactionRepo.delete(transactionId, tx);


            //Kembalikan Saldo (Reverse Logic)
            let reverseBalance = Number(wallet.balance);
            const amount = Number(transaction.amount);

            if (transaction.type === "INCOME") reverseBalance -= amount;
            else reverseBalance += amount;

            await tx.wallet.update({
                where: { id: wallet.id },
                data: { balance: reverseBalance }
            });
            return { message: "Transaksi berasil di hapus dan saldo dikembalikan" }
        });
    }
}