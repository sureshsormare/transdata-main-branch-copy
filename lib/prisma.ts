import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  datasources: {
    db: {
      url: process.env.MONGODB_URI,
    },
  },
  // Add connection timeout settings
  log: ['error'], // Only log errors, disable query logs
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Add connection health check function
export async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
  
    return { isConnected: true, error: null };
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return { isConnected: false, error: error instanceof Error ? error.message : 'Unknown database error' };
  }
}

// Add graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
