import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function testInclude() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'marcus@dentispark.com' },
      include: { mentorProfile: true }
    });
    console.log("Success!", !!user);
  } catch (error) {
    console.error("Prisma error:", error);
  } finally {
    await prisma.$disconnect();
  }
}
testInclude();
