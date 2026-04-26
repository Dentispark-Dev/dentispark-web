import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function check() {
  const email = "marcus.thorne@dentispark.com";
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    console.log(`User ${email} NOT found!`);
    return;
  }

  console.log(`User found: ${user.name}`);
  
  if (!user.password) {
    console.log("No password set. Setting default password...");
    const hashedPassword = await bcrypt.hash("password123", 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });
    console.log("Password set to: password123");
  } else {
    console.log("Password already exists. I will reset it to 'password123' for you.");
    const hashedPassword = await bcrypt.hash("password123", 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });
    console.log("Password reset to: password123");
  }
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
