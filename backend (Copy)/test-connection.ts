// test-connection.ts
import prisma from './src/database'; // Sesuaikan path ke file database.ts kamu

async function main() {
  try {
    console.log("⏳ Mencoba koneksi ke Neon via Pooling...");
    // Coba query sederhana
    const result = await prisma.$queryRaw`SELECT NOW()`;
    console.log("✅ SUKSES! Terhubung ke Neon.");
    console.log("⏰ Waktu Server DB:", result);
  } catch (error) {
    console.error("❌ Gagal koneksi:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();