import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query', 'error', 'warn'],
  })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

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
