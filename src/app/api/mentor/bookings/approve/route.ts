import { NextResponse } from "next/server";
import prisma from "@/src/lib/db";

export async function POST(req: Request) {
  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json({ error: "Missing bookingId." }, { status: 400 });
    }

    // 1. Fetch booking with mentor and student info
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { 
        mentor: { include: { user: true } }, 
        student: true 
      }
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    // 2. Update status to CONFIRMED
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CONFIRMED" }
    });

    // 3. Generate Daily.co room link
    let roomUrl = "";
    try {
      const DAILY_API_KEY = process.env.DAILY_API_KEY;
      if (DAILY_API_KEY) {
        const roomName = `dentispark-${booking.mentor.user.sid || "mentor"}-${bookingId}`.toLowerCase().replace(/[^a-z0-9-]/g, "-");
        const response = await fetch("https://api.daily.co/v1/rooms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${DAILY_API_KEY}`,
          },
          body: JSON.stringify({
            name: roomName,
            privacy: "private",
            properties: { max_participants: 2, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 } // 24h expiry
          }),
        });
        const room = await response.json();
        roomUrl = room.url || "";

        if (roomUrl) {
          await prisma.booking.update({
            where: { id: bookingId },
            data: { meetingLink: roomUrl }
          });
        }
      }
    } catch (err) {
      console.error("Daily.co generation failed:", err);
    }

    // 4. Send Confirmation Notification to Student
    await prisma.platformActivity.create({
      data: {
        userId: booking.studentId,
        action: "BOOKING_CONFIRMED",
        details: `Your session with ${booking.mentor.user.name} has been confirmed!`,
        category: "MENTORSHIP"
      }
    });

    // 5. Send Email to Student
    try {
        const { emailService } = await import("@/src/lib/email-service");
        await emailService.sendBookingConfirmation(
          booking.student.email || "",
          booking.mentor.user.name || "Your Mentor",
          "Mentorship Session"
        );
    } catch (err) {
        console.error("Email notification failed:", err);
    }

    return NextResponse.json({ success: true, roomUrl });
  } catch (error) {
    console.error("Approval Error:", error);
    return NextResponse.json({ error: "Failed to approve booking." }, { status: 500 });
  }
}
