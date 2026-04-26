import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function check() {
  const name = "Dt. Marcus Thorne";
  const user = await prisma.user.findFirst({
    where: { name }
  });

  if (!user) {
    console.log(`User ${name} NOT found!`);
    return;
  }

  console.log(`User found: ${user.name}`);
  console.log(`Email: ${user.email}`);
  console.log(`SID: ${user.sid}`);
  
  const hashedPassword = await bcrypt.hash("password123", 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword }
  });
  console.log("Password set/reset to: password123");
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
