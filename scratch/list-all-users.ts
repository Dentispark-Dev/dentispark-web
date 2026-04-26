import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function check() {
  const users = await prisma.user.findMany({
    select: {
      name: true,
      email: true,
      sid: true,
      role: true
    }
  });

  console.log("Total Users:", users.length);
  users.forEach(u => {
    console.log(`- Name: ${u.name}, Email: ${u.email}, SID: ${u.sid}, Role: ${u.role}`);
  });
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
