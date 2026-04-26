const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testDelete() {
  const email = process.argv[2];
  if (!email) {
    console.error("Please provide an email");
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log("User not found");
      return;
    }

    console.log("Found user:", user.id, user.email);

    await prisma.user.delete({
      where: { id: user.id }
    });

    console.log("Successfully deleted user");
  } catch (error) {
    console.error("Error deleting user:", error);
    if (error.code === 'P2003') {
      console.error("Foreign Key Constraint Error. Related records exist.");
    }
  } finally {
    await prisma.$disconnect();
  }
}

testDelete();
