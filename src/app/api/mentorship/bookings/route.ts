import { NextResponse } from "next/server";
import prisma from "@/src/lib/db";

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
  } catch (error: unknown) {
    console.error("Fetch Bookings Error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { studentId, mentorSlug, scheduledDate, scheduledTime, sessionType, durationMins, price } = await req.json();

    if (!studentId || !scheduledDate || !scheduledTime || !mentorSlug) {
      return NextResponse.json({ error: "Missing required booking details" }, { status: 400 });
    }

    // Look up mentor profile by their sid (System Identity) or name
    const mentorProfile = await prisma.mentorProfile.findFirst({
      where: {
        OR: [
          { user: { sid: mentorSlug } },
          { user: { name: { contains: mentorSlug, mode: "insensitive" } } }
        ]
      },
      include: { user: { select: { name: true, email: true } } }
    }) as any;

    if (!mentorProfile) {
      console.warn(`Mentor not found for slug: ${mentorSlug}`);
      return NextResponse.json({ error: "Mentor not found. Please try again or contact support." }, { status: 404 });
    }

    // Create the combined scheduledAt DateTime
    const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}:00`);

    if (isNaN(scheduledAt.getTime())) {
      return NextResponse.json({ error: "Invalid date or time format." }, { status: 400 });
    }

    // If paid session, create a PENDING booking and return Stripe params
    if (price && price > 0) {
      const booking = await prisma.booking.create({
        data: {
          studentId,
          mentorId: mentorProfile.id,
          scheduledAt,
          durationMins: durationMins || 60,
          status: "PENDING",
        }
      });

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.dentispark.com";
      return NextResponse.json({
        requiresPayment: true,
        stripeParams: {
          mentorName: mentorProfile.user?.name || mentorSlug,
          sessionType,
          price,
          mentorSlug,
          studentId,
          bookingId: booking.id,
          successUrl: `${baseUrl}/mentorship/${mentorSlug}/booking-confirmed?session=${encodeURIComponent(sessionType)}`,
          cancelUrl: `${baseUrl}/mentorship/${mentorSlug}/checkout?session=${sessionType}`,
        }
      });
    }

    // Free session — confirm immediately
    const booking = await prisma.booking.create({
      data: {
        studentId,
        mentorId: mentorProfile.id,
        scheduledAt,
        durationMins: durationMins || 15,
        status: "CONFIRMED",
      }
    });

    return NextResponse.json({ 
      success: true, 
      bookingId: booking.id,
      url: `/mentorship/${mentorSlug}/booking-confirmed?session=${encodeURIComponent(sessionType)}&free=true`
    });
  } catch (error: unknown) {
    console.error("Create Booking Error:", error);
    return NextResponse.json({ error: "Failed to create booking." }, { status: 500 });
  }
}
