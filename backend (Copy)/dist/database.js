// src/database.ts
import { PrismaClient } from ".././dist/generated/index.js";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import config from "./utils/env.js";
const globalForPrisma = globalThis;
const prismaClientSingleton = () => {
    // Neon menggunakan SSL, pastikan pool-nya menghandle ini
    const pool = new Pool({
        connectionString: config.DATABASE_URL
    });
    const adapter = new PrismaPg(pool);
    // Di Prisma 7.2, saat pakai adapter, 
    // kita tidak perlu lagi mengoper datasourceUrl di sini
    return new PrismaClient({
        adapter,
        log: ["query", "info", "warn", "error"],
    });
};
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();
if (config.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
export default prisma;
//# sourceMappingURL=database.js.map
