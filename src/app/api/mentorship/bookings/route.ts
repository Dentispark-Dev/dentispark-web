import { NextResponse } from "next/server";
import prisma from "@/src/lib/db";
import { parseISO } from "date-fns";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const role = searchParams.get("role"); // 'STUDENT' or 'MENTOR'

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    let bookings;

    if (role === "MENTOR") {
      const profile = await prisma.mentorProfile.findUnique({ where: { userId } });
      if (!profile) return NextResponse.json({ bookings: [] });
      
      bookings = await prisma.booking.findMany({
        where: { mentorId: profile.id },
        include: { student: { select: { name: true, image: true, email: true } } },
        orderBy: { scheduledAt: "asc" }
      });
    } else {
      bookings = await prisma.booking.findMany({
        where: { studentId: userId },
        include: { mentor: { include: { user: { select: { name: true, image: true } } } } },
        orderBy: { scheduledAt: "asc" }
      });
    }

    return NextResponse.json({ bookings });
  } catch (error: any) {
    console.error("Fetch Bookings Error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { studentId, mentorSlug, scheduledDate, scheduledTime, sessionType, durationMins } = await req.json();

    if (!studentId || !scheduledDate || !scheduledTime) {
      return NextResponse.json({ error: "Missing required booking details" }, { status: 400 });
    }

    // 1. Find MentorProfile by ID or slug (searching for any for now as slug bridge is missing)
    // In a real app we'd search by Slug. 
    const mentorProfile = await prisma.mentorProfile.findFirst({
        // where: { slug: mentorSlug }
    });

    if (!mentorProfile) {
      return NextResponse.json({ error: "Mentor not found" }, { status: 404 });
    }

    // 2. Create the combined scheduledAt DateTime
    const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}:00`);

    // 3. Create confirmed booking (bypassing stripe payment gate)
    const booking = await prisma.booking.create({
      data: {
        studentId,
        mentorId: mentorProfile.id,
        scheduledAt,
        durationMins: durationMins || 60,
        status: "CONFIRMED",
      }
    });

    return NextResponse.json({ 
      success: true, 
      bookingId: booking.id,
      url: `/mentorship/${mentorSlug}/booking-confirmed?id=${booking.id}` // Frontend redirect URL
    });
  } catch (error: any) {
    console.error("Create Booking Error:", error);
    return NextResponse.json({ error: "Failed to create booking." }, { status: 500 });
  }
}
