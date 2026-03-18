import { PrismaClient } from "@prisma/client";

type PrismaGlobal = typeof globalThis & {
  db?: PrismaClient;
};

const globalForDb = globalThis as PrismaGlobal;

export const db = globalForDb.db ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db;
}

export default db;
