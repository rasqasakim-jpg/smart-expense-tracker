// src/database.ts
import { PrismaClient } from "./generated"; // import dari folder generated
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import config from "./utils/env";

// 1. Definisikan tipe global agar TypeScript tidak komplain
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// 2. Fungsi inisialisasi Prisma dengan Adapter
const prismaClientSingleton = () => {
    const pool = new Pool({ 
        connectionString: config.DATABASE_URL 
    });
    
    const adapter = new PrismaPg(pool);
    
    return new PrismaClient({ 
        adapter,
        // Tambahkan log biar enak debugging
        log: ['query', 'info', 'warn', 'error'], 
    });
};

// 3. Logic Singleton (Cek Global dulu)
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

// 4. Simpan ke global jika di mode development
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}