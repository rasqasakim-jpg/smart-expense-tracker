import { PrismaClient } from "./generated/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import config from "./utils/env.js";
let prisma;
const getPrisma = () => {
    if (!prisma) {
        const pool = new Pool({
            connectionString: config.DATABASE_URL
        });
        const adapter = new PrismaPg(pool);
        prisma = new PrismaClient({ adapter });
    }
    return prisma;
};
const prismaInstanse = getPrisma();
export default prismaInstanse;
//# sourceMappingURL=database.js.map
