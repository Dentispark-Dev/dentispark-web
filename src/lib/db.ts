import { PrismaClient } from '@prisma/client'
import { LooseRecord } from "@/src/types/loose";

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query', 'error', 'warn'],
  })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

/**
 * Legacy query wrapper to support existing code using direct SQL.
 * Wraps prisma.$queryRawUnsafe and returns an object with a 'rows' property
 * to match the expected pg-client interface.
 */
export const query = async (text: string, params: unknown[] = []) => {
  try {
    const result = await prisma.$queryRawUnsafe(text, ...params) as LooseRecord[];
    return { rows: result };
  } catch (error) {
    console.error('Database Query Error:', error);
    throw error;
  }
}

// Connection Test
async function testConnection() {
  try {
    await prisma.$connect()
    console.log('Successfully connected to the Contabo Database.')
  } catch (error) {
    console.error('Failed to connect to the database:', error)
  }
}

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
  testConnection()
}

export default prisma
