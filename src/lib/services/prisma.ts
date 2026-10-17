import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../prisma/generated/prisma/client";


const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrisma() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");

  // pg currently treats sslmode=require as verify-full and will weaken that later.
  const adapter = new PrismaPg({
    connectionString: connectionString.replace(
      "sslmode=require",
      "sslmode=verify-full",
    ),
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
