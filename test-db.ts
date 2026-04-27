import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const hiddenUsers = await prisma.deletedLegacyUser.findMany();
  console.log("Hidden Users in DB:", hiddenUsers);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
