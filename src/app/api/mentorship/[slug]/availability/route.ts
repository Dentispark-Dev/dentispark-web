import { NextResponse } from "next/server";
import prisma from "@/src/lib/db";
import { startOfDay, endOfDay, addDays, format, parseISO } from "date-fns";
import { LooseRecord } from "@/src/types/loose";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // 1. Try to find the mentor by slug (matching sid or name)
    let mentorProfile = await prisma.mentorProfile.findFirst({
      where: {
        OR: [
          { user: { sid: slug } },
          { user: { name: { contains: slug, mode: 'insensitive' } } }
        ]
      },
      include: { user: true }
    });

    // Fallback: If not found, just take the first mentor for demo/test
    if (!mentorProfile) {
      mentorProfile = await prisma.mentorProfile.findFirst({
        include: { user: true }
      });
    }

    // 2. Default availability if mentor has none (for testing)
    const defaultAvailability = {
      Monday: { enabled: true, slots: [{ start: "09:00" }, { start: "10:00" }, { start: "11:00" }, { start: "14:00" }, { start: "15:00" }] },
      Tuesday: { enabled: true, slots: [{ start: "09:00" }, { start: "10:00" }, { start: "11:00" }, { start: "14:00" }, { start: "15:00" }] },
      Wednesday: { enabled: true, slots: [{ start: "09:00" }, { start: "10:00" }, { start: "11:00" }, { start: "14:00" }, { start: "15:00" }] },
      Thursday: { enabled: true, slots: [{ start: "09:00" }, { start: "10:00" }, { start: "11:00" }, { start: "14:00" }, { start: "15:00" }] },
      Friday: { enabled: true, slots: [{ start: "09:00" }, { start: "10:00" }, { start: "11:00" }, { start: "14:00" }, { start: "15:00" }] },
      Saturday: { enabled: true, slots: [{ start: "10:00" }, { start: "11:00" }] },
      Sunday: { enabled: true, slots: [{ start: "10:00" }, { start: "11:00" }] }
    };

    const mentorAvailability = mentorProfile?.availability as LooseRecord;
    const availability = (mentorAvailability && Object.keys(mentorAvailability).length > 0) 
      ? mentorAvailability 
      : defaultAvailability;

    // 3. Load existing bookings
    const bookings = mentorProfile ? await prisma.booking.findMany({
      where: {
        mentorId: mentorProfile.id,
        scheduledAt: {
          gte: new Date(),
          lte: addDays(new Date(), 30)
        },
        status: { not: "CANCELLED" }
      }
    }) : [];

    return NextResponse.json({
      availability,
      bookedSlots: bookings.map(b => ({
        date: format(b.scheduledAt, "yyyy-MM-dd"),
        time: format(b.scheduledAt, "HH:mm")
      }))
    });
  } catch (error: unknown) {
    console.error("Public Availability Error:", error);
    return NextResponse.json({ error: "Failed to fetch availability." }, { status: 500 });
  }
}
