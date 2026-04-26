import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkPasswords() {
  try {
    const users = await prisma.user.findMany({ select: { email: true, password: true, role: true } });
    console.log("Users:");
    users.forEach(u => console.log(`${u.email} | ${u.role} | ${u.password}`));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
checkPasswords();
