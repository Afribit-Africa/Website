import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function sanitizeDatabaseUrl(url: string | undefined) {
  return url?.replace(/\\r\\n/g, '').replace(/[\r\n]+/g, '').trim()
}

const databaseUrl =
  sanitizeDatabaseUrl(process.env.afribit_DATABASE_URL) ??
  sanitizeDatabaseUrl(process.env.DATABASE_URL)

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(databaseUrl ? { datasources: { db: { url: databaseUrl } } } : undefined)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
