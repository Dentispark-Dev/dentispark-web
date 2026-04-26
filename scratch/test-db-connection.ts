import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function test() {
  try {
    const userCount = await prisma.user.count();
    console.log("Database connection successful. User count:", userCount);
    const users = await prisma.user.findMany({ take: 5 });
    console.log("Sample users:", users.map(u => ({ email: u.email, role: u.role })));
  } catch (error) {
    console.error("Database connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
