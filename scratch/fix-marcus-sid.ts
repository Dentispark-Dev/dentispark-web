import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fix() {
  const mentorName = "Dt. Marcus Thorne";
  const targetSid = "dt-marcus-thorne";

  console.log(`Fixing SID for ${mentorName} to ${targetSid}...`);

  const user = await prisma.user.findFirst({
    where: { name: mentorName }
  });

  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: { sid: targetSid }
    });
    console.log("SID Updated successfully.");
  } else {
    console.log("Mentor user not found by name.");
  }
}

fix()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
