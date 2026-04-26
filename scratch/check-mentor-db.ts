import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function check() {
  const mentor = await prisma.mentorProfile.findFirst({
    where: { user: { sid: "dt-marcus-thorne" } },
    include: { user: true }
  });

  if (!mentor) {
    console.log("Mentor NOT found in DB!");
    return;
  }

  console.log("Mentor Found:", mentor.user.name);
  console.log("Availability:", JSON.stringify(mentor.availability, null, 2));

  const now = new Date();
  const next30 = new Date();
  next30.setDate(now.getDate() + 30);

  const bookings = await prisma.booking.findMany({
    where: {
      mentorId: mentor.id,
      scheduledAt: { gte: now, lte: next30 },
      status: { not: "CANCELLED" }
    }
  });

  console.log("Active Bookings count:", bookings.length);
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
