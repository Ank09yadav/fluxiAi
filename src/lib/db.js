import { PrismaClient } from "@prisma/client";
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;

const prismaClientSingleton = () => {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter, log: ['query', 'info', 'warn', 'error'] });
}

export const db = globalThis.prisma || prismaClientSingleton();

if (process.env.NODE_ENV === "development") {
    globalThis.prisma = db;
}
export default db;