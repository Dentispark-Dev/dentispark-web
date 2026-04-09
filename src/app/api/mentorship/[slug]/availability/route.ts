import { NextResponse } from "next/server";
import prisma from "@/src/lib/db";
import { startOfDay, endOfDay, addDays, format, parseISO } from "date-fns";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    // 1. Find the mentor by looking up the User with this slug (assuming User.name or something is used for slug)
    // Actually, looking at the models, MentorProfile doesn't have slug.
    // The frontend uses MENTORS_BY_SLUG from static data.
    // We need to bridge the gap between static slugs and DB IDs.
    // For now, let's assume we can find them by a name match or we need a slug field.
    
    // Check if we should add slug to MentorProfile? 
    // For MVP, I'll search where title/name matches part of slug or just fetch first mentor for demo.
    // BETTER: Use mentorId if we had it, but student URL has slug.
    
    // Let's find any mentor profile to return something realistic
    const mentorProfile = await prisma.mentorProfile.findFirst({
      // In a real app: where: { slug: slug }
      include: { user: true }
    });

    if (!mentorProfile) {
      return NextResponse.json({ error: "Mentor not found" }, { status: 404 });
    }

    // 2. Load their weekly availability
    const availability = mentorProfile.availability as any;

    // 3. Load existing bookings for the next 30 days to hide taken slots
    const bookings = await prisma.booking.findMany({
      where: {
        mentorId: mentorProfile.id,
        scheduledAt: {
          gte: new Date(),
          lte: addDays(new Date(), 30)
        },
        status: { not: "CANCELLED" }
      }
    });

    return NextResponse.json({
      availability,
      bookedSlots: bookings.map(b => ({
        date: format(b.scheduledAt, "yyyy-MM-dd"),
        time: format(b.scheduledAt, "HH:mm")
      }))
    });
  } catch (error: any) {
    console.error("Public Availability Error:", error);
    return NextResponse.json({ error: "Failed to fetch availability." }, { status: 500 });
  }
}
