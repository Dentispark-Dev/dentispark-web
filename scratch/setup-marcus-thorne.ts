import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const mentorName = "Dt. Marcus Thorne";
  const mentorSlug = "dt-marcus-thorne";
  const mentorEmail = "marcus.thorne@dentispark.com";

  console.log(`Checking for mentor: ${mentorName}...`);

  let user = await prisma.user.findFirst({
    where: { OR: [{ email: mentorEmail }, { name: mentorName }] }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: mentorName,
        email: mentorEmail,
        role: "MENTOR",
        sid: mentorSlug,
        activationStatus: "ACTIVE",
        memberCategory: "DENTAL",
      }
    });
    console.log(`Created user: ${user.id}`);
  }

  let profile = await prisma.mentorProfile.findUnique({
    where: { userId: user.id }
  });

  if (!profile) {
    profile = await prisma.mentorProfile.create({
      data: {
        userId: user.id,
        title: "Orthodontist, Univ of Pennsylvania",
        credentials: "BDS, MDS (Orthodontics)",
        bio: "Dr. Marcus Thorne is a leading orthodontist with over 15 years of experience. He specializes in clinical ethics and MMI preparation for elite dental schools.",
        specialties: ["Orthodontics", "MMI Prep", "Clinical Ethics"],
        hourlyRate: 175.0,
        currency: "£",
        isVerified: true,
        isAvailable: true,
        availability: {
          Monday: { enabled: true, slots: [{ start: "09:00" }, { start: "10:00" }, { start: "11:00" }, { start: "14:00" }, { start: "15:00" }] },
          Tuesday: { enabled: true, slots: [{ start: "09:00" }, { start: "10:00" }, { start: "11:00" }, { start: "14:00" }, { start: "15:00" }] },
          Wednesday: { enabled: true, slots: [{ start: "09:00" }, { start: "10:00" }, { start: "11:00" }, { start: "14:00" }, { start: "15:00" }] },
          Thursday: { enabled: true, slots: [{ start: "09:00" }, { start: "10:00" }, { start: "11:00" }, { start: "14:00" }, { start: "15:00" }] },
          Friday: { enabled: true, slots: [{ start: "09:00" }, { start: "10:00" }, { start: "11:00" }, { start: "14:00" }, { start: "15:00" }] },
          Saturday: { enabled: true, slots: [{ start: "10:00" }, { start: "11:00" }] },
          Sunday: { enabled: true, slots: [{ start: "10:00" }, { start: "11:00" }] }
        }
      }
    });
    console.log(`Created profile: ${profile.id}`);
  } else {
    // Update availability just in case
    await prisma.mentorProfile.update({
      where: { id: profile.id },
      data: {
        availability: {
          Monday: { enabled: true, slots: [{ start: "09:00" }, { start: "10:00" }, { start: "11:00" }, { start: "14:00" }, { start: "15:00" }] },
          Tuesday: { enabled: true, slots: [{ start: "09:00" }, { start: "10:00" }, { start: "11:00" }, { start: "14:00" }, { start: "15:00" }] },
          Wednesday: { enabled: true, slots: [{ start: "09:00" }, { start: "10:00" }, { start: "11:00" }, { start: "14:00" }, { start: "15:00" }] },
          Thursday: { enabled: true, slots: [{ start: "09:00" }, { start: "10:00" }, { start: "11:00" }, { start: "14:00" }, { start: "15:00" }] },
          Friday: { enabled: true, slots: [{ start: "09:00" }, { start: "10:00" }, { start: "11:00" }, { start: "14:00" }, { start: "15:00" }] },
          Saturday: { enabled: true, slots: [{ start: "10:00" }, { start: "11:00" }] },
          Sunday: { enabled: true, slots: [{ start: "10:00" }, { start: "11:00" }] }
        }
      }
    });
    console.log("Updated availability.");
  }

  console.log("Setup complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
