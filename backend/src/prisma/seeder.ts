// 1. Import prisma instance dari database.ts kamu
import prisma from '../database';

// 2. Import Enum & Tipe dari Prisma Client untuk validasi data
import { TransactionType, UserRole, OtpType } from '@prisma/client';

import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

class DatabaseSeeder {
  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  public async run() {
    console.log("🚀 Memulai proses seeding (via src/database.ts)...");

    // 1. CLEANUP (Hapus data lama)
    try {
      // Hapus tabel child dulu baru parent (Reverse Order)
      await prisma.attachment.deleteMany();
      await prisma.transaction.deleteMany();
      await prisma.budget.deleteMany();
      await prisma.activityLog.deleteMany();
      await prisma.notification.deleteMany();
      await prisma.otp.deleteMany();
      await prisma.refreshToken.deleteMany();
      await prisma.passwordReset.deleteMany();
      await prisma.wallet.deleteMany();
      await prisma.user.deleteMany();
      await prisma.category.deleteMany();
      console.log("🧹 Database berhasil dibersihkan.");
    } catch (error) {
      console.log("⚠️  Gagal membersihkan database, lanjut seeding...");
    }

    const password = await this.hashPassword("password123");

    // 2. SEED CATEGORIES (Pakai Enum TransactionType)
    console.log("🌱 Seeding Categories...");
    const catGaji = await prisma.category.create({ data: { name: 'Gaji', type: TransactionType.INCOME } });
    const catBonus = await prisma.category.create({ data: { name: 'Bonus', type: TransactionType.INCOME } });
    
    const catMakan = await prisma.category.create({ data: { name: 'Makanan', type: TransactionType.EXPENSE } });
    const catTransport = await prisma.category.create({ data: { name: 'Transportasi', type: TransactionType.EXPENSE } });
    const catBelanja = await prisma.category.create({ data: { name: 'Belanja', type: TransactionType.EXPENSE } });

    // 3. SEED USERS & RELATIONS
    console.log("🌱 Seeding Users, Wallets, & Data Lainnya...");

    for (let i = 0; i < 5; i++) {
      // --- A. Create USER ---
      const user = await prisma.user.create({
        data: {
          full_name: faker.person.fullName(),
          email: faker.internet.email(),
          password: password,
          role: i === 0 ? UserRole.ADMIN : UserRole.USER,
        }
      });

      // --- B. Create WALLETS ---
      const walletCash = await prisma.wallet.create({
        data: { name: "Dompet Tunai", balance: 1000000, type: "CASH", user_id: user.id }
      });
      const walletBank = await prisma.wallet.create({
        data: { name: "Bank BCA", balance: 50000000, type: "BANK", user_id: user.id }
      });

      // --- C. Create BUDGET ---
      await prisma.budget.create({
        data: {
          monthly_limit: 5000000,
          month_year: new Date(),
          user_id: user.id
        }
      });

      // --- D. Create REFRESH TOKEN ---
      await prisma.refreshToken.create({
        data: {
          token: faker.string.uuid(),
          expires_at: faker.date.future(),
          user_id: user.id
        }
      });

      // --- E. Create OTP (Pakai OtpType.REGISTRATION) ---
      await prisma.otp.create({
        data: {
          code: faker.string.numeric(6),
          type: OtpType.REGISTRATION, 
          expired_at: faker.date.recent(),
          user_id: user.id
        }
      });

      // --- F. Create NOTIFICATION ---
      await prisma.notification.createMany({
        data: [
          {
            user_id: user.id,
            title: "Selamat Datang!",
            content: "Akun Smart Expense Tracker Anda aktif.",
            is_read: true
          },
          {
            user_id: user.id,
            title: "Info",
            content: "Cek laporan keuangan bulanan Anda.",
            is_read: false
          }
        ]
      });

      // --- G. Create PASSWORD RESET (Hanya user ke-2) ---
      if (i === 1) {
        await prisma.passwordReset.create({
          data: {
            email: user.email,
            token: faker.string.alphanumeric(20)
          }
        });
      }

      // --- H. Create ACTIVITY LOG ---
      await prisma.activityLog.create({
        data: {
          user_id: user.id,
          action: "LOGIN",
          description: "Login berhasil via Web"
        }
      });

      // --- I. Create TRANSACTIONS & ATTACHMENT ---
      
    await prisma.transaction.createMany({
        data: [
          // Transaksi 1: Makan (Expense)
          {
            amount: 25000,
            note: "Makan Siang Warteg",
            type: TransactionType.EXPENSE,
            transaction_date: faker.date.recent(),
            user_id: user.id,
            wallet_id: walletCash.id,
            category_id: catMakan.id
          },
          // Transaksi 2: Transportasi (PAKAI catTransport DISINI) ✅
          {
            amount: 15000,
            note: "Ojek Online ke Kantor",
            type: TransactionType.EXPENSE,
            transaction_date: faker.date.recent(), // Transaksi baru-baru ini
            user_id: user.id,
            wallet_id: walletCash.id, // Bayar pakai tunai
            category_id: catTransport.id // <-- Variabel catTransport terpakai!
          },
          // Transaksi 3: Belanja (PAKAI catBelanja DISINI) ✅
          {
            amount: 750000,
            note: "Belanja Bulanan Superindo",
            type: TransactionType.EXPENSE,
            transaction_date: faker.date.past(), // Transaksi bulan lalu
            user_id: user.id,
            wallet_id: walletBank.id, // Bayar transfer bank
            category_id: catBelanja.id // <-- Variabel catBelanja terpakai!
          },
          // Transaksi 4: Gaji (Income)
          {
            amount: 8000000,
            note: "Gaji Pokok",
            type: TransactionType.INCOME,
            transaction_date: faker.date.past(),
            user_id: user.id,
            wallet_id: walletBank.id,
            category_id: catGaji.id
          },
          // Transaksi 5: Bonus (Income)
          {
            amount: 1500000,
            note: "Bonus Lembur",
            type: TransactionType.INCOME,
            transaction_date: faker.date.recent(),
            user_id: user.id,
            wallet_id: walletBank.id,
            category_id: catBonus.id
          }
        ]
      });

      // --- J. Attachment (Opsional untuk salah satu transaksi saja) ---
      // Karena createMany tidak mengembalikan ID satu per satu, 
      // kita query satu transaksi terakhir buat ditempel struk
      const lastTrx = await prisma.transaction.findFirst({
        where: { user_id: user.id },
        orderBy: { transaction_date: 'desc' }
      });

      if (lastTrx) {
        await prisma.attachment.create({
          data: {
            transaction_id: lastTrx.id,
            file_path: "uploads/struk-belanja.jpg",
            file_type: "image/jpeg"
          }
        });
      }
    }

    console.log("🌳 SEEDING SELESAI! Data dummy siap digunakan.");
  }
}

// Jalankan Seeder
new DatabaseSeeder().run()
  .catch(e => {
    console.error("❌ Error Seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    // Tidak perlu prisma.$disconnect() manual karena import dari singleton database.ts
    // Tapi jika ingin force close:
    await prisma.$disconnect();
  });