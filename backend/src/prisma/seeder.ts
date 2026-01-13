import prisma from '../database';
import { TransactionType, UserRole, OtpType } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

class DatabaseSeeder {
  // Helper untuk hash password
  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  public async run() {
    console.log("🚀 Memulai proses seeding...");

    // ==========================================
    // 1. CLEANUP (Hapus data lama)
    // ==========================================
    try {
      // Urutan delete: Child -> Parent (untuk menghindari foreign key constraint error)
      await prisma.attachment.deleteMany();
      await prisma.transaction.deleteMany();
      await prisma.budget.deleteMany();
      await prisma.activityLog.deleteMany();
      await prisma.notification.deleteMany();
      await prisma.otp.deleteMany();
      await prisma.refreshToken.deleteMany();
      await prisma.passwordReset.deleteMany();
      await prisma.wallet.deleteMany();
      
      // Hapus Profile dulu sebelum User
      await prisma.profile.deleteMany(); 
      await prisma.user.deleteMany();
      
      await prisma.category.deleteMany();
      console.log("🧹 Database berhasil dibersihkan.");
    } catch (error) {
      console.log("⚠️  Pemberitahuan: Database mungkin sudah bersih atau tabel belum ada.");
    }

    const password = await this.hashPassword("password123");

    // ==========================================
    // 2. SEED GLOBAL CATEGORIES
    // ==========================================
    // Note: Pastikan di schema.prisma 'user_id' pada model Category bersifat optional (Int?)
    console.log("🌱 Seeding Categories...");
    const catGaji = await prisma.category.create({ data: { name: 'Gaji', type: TransactionType.INCOME } });
    const catBonus = await prisma.category.create({ data: { name: 'Bonus', type: TransactionType.INCOME } });
    
    const catMakan = await prisma.category.create({ data: { name: 'Makanan', type: TransactionType.EXPENSE } });
    const catTransport = await prisma.category.create({ data: { name: 'Transportasi', type: TransactionType.EXPENSE } });
    const catBelanja = await prisma.category.create({ data: { name: 'Belanja', type: TransactionType.EXPENSE } });

    // ==========================================
    // 3. SEED USERS, PROFILES & DATA RELASI
    // ==========================================
    console.log("🌱 Seeding Users, Profiles & Transactions...");

    // Loop membuat 5 User Dummy
    for (let i = 0; i < 5; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const username = `${firstName.toLowerCase()}${faker.string.numeric(3)}`; 

      // --- A. Create USER + PROFILE ---
      const user = await prisma.user.create({
        data: {
          full_name: `${firstName} ${lastName}`,
          email: faker.internet.email({ firstName, lastName }).toLowerCase(),
          password: password,
          role: i === 0 ? UserRole.ADMIN : UserRole.USER, // User pertama jadi Admin
          
          // Nested Write untuk Profile
          profile: {
            create: {
              username: username,
              address: faker.location.streetAddress(),
              occupation: faker.person.jobTitle(),
              date_of_birth: faker.date.birthdate({ min: 18, max: 60, mode: 'age' })
            }
          }
        },
        include: {
          profile: true
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

      // --- E. Create OTP ---
      await prisma.otp.create({
        data: {
          code: faker.string.numeric(6),
          type: OtpType.REGISTRATION, 
          expired_at: new Date(Date.now() + 15 * 60 * 1000), // Expired 15 menit lagi
          user_id: user.id
        }
      });

      // --- F. Create NOTIFICATION ---
      await prisma.notification.createMany({
        data: [
          {
            user_id: user.id,
            title: "Selamat Datang!",
            content: `Halo ${username}, selamat bergabung di Smart Expense Tracker!`,
            is_read: true
          },
          {
            user_id: user.id,
            title: "Lengkapi Profil",
            content: "Lengkapi data profil Anda untuk pengalaman lebih baik.",
            is_read: false
          }
        ]
      });

      // --- G. Create PASSWORD RESET (Hanya user ke-2 untuk simulasi) ---
      if (i === 1) {
        await prisma.passwordReset.create({
          data: {
            email: user.email,
            token: faker.string.alphanumeric(20),
           
          }
        });
      }

      // --- H. Create ACTIVITY LOG ---
      await prisma.activityLog.create({
        data: {
          user_id: user.id,
          action: "REGISTER",
          description: "User berhasil mendaftar ke dalam sistem"
        }
      });

// --- I. Create TRANSACTIONS ---
      // PERBAIKAN: Menambahkan field 'name' yang wajib ada
      await prisma.transaction.createMany({
        data: [
          {
            name: "Makan Siang", // <--- Field ini sebelumnya kurang
            amount: 25000,
            note: "Warteg Bahari, menu paket ayam",
            type: TransactionType.EXPENSE,
            transaction_date: faker.date.recent(),
            user_id: user.id,
            wallet_id: walletCash.id,
            category_id: catMakan.id
          },
          {
            name: "Transportasi Kantor", // <--- Ditambahkan
            amount: 15000,
            note: "Ojek Online (Gojek/Grab)",
            type: TransactionType.EXPENSE,
            transaction_date: faker.date.recent(),
            user_id: user.id,
            wallet_id: walletCash.id,
            category_id: catTransport.id
          },
          {
            name: "Belanja Bulanan", // <--- Ditambahkan
            amount: 750000,
            note: "Superindo - Beras, Minyak, dll",
            type: TransactionType.EXPENSE,
            transaction_date: faker.date.past(),
            user_id: user.id,
            wallet_id: walletBank.id,
            category_id: catBelanja.id
          },
          {
            name: "Gaji Bulanan", // <--- Ditambahkan
            amount: 8000000,
            note: "Gaji Pokok Bulan Ini",
            type: TransactionType.INCOME,
            transaction_date: faker.date.past(),
            user_id: user.id,
            wallet_id: walletBank.id,
            category_id: catGaji.id
          },
          {
            name: "Bonus Project", // <--- Ditambahkan
            amount: 1500000,
            note: "Bonus Lembur Project A",
            type: TransactionType.INCOME,
            transaction_date: faker.date.recent(),
            user_id: user.id,
            wallet_id: walletBank.id,
            category_id: catBonus.id
          }
        ]
      });

      // --- J. Attachment (Struk untuk transaksi terakhir) ---
      // Ambil transaksi terakhir yang baru saja dibuat user ini
      const lastTrx = await prisma.transaction.findFirst({
        where: { user_id: user.id },
        orderBy: { transaction_date: 'desc' }
      });

      if (lastTrx) {
        await prisma.attachment.create({
          data: {
            transaction_id: lastTrx.id,
            file_path: "uploads/dummy-receipt.jpg",
            file_type: "image/jpeg"
          }
        });
      }
    }

    console.log("🌳 SEEDING SELESAI! Data dummy (termasuk Profile & Transaksi) siap digunakan.");
  }
}

// Menjalankan Seeder
new DatabaseSeeder().run()
  .catch(e => {
    console.error("❌ Error Seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });