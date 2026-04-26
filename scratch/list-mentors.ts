import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function check() {
  const users = await prisma.user.findMany({
    where: { role: "MENTOR" },
    include: { mentorProfile: true }
  });

  console.log("Total Mentors:", users.length);
  users.forEach(u => {
    console.log(`- ${u.name} (SID: ${u.sid}, ID: ${u.id}) - Profile: ${u.mentorProfile ? 'YES' : 'NO'}`);
  });
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
