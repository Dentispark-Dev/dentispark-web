import { NextResponse } from "next/server";
import prisma from "@/src/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId },
      include: {
        bookings: {
          include: { student: { select: { name: true } } }
        },
        reviews: {
          select: { rating: true }
        }
      }
    });

    if (!mentorProfile) {
      return NextResponse.json({ error: "Mentor profile not found" }, { status: 404 });
    }

    const totalBookings = mentorProfile.bookings.length;
    const completedBookings = mentorProfile.bookings.filter(b => b.status === "COMPLETED");
    const totalEarnings = completedBookings.reduce((acc, b) => acc + (mentorProfile.hourlyRate * (b.durationMins / 60)), 0);
    const totalHours = mentorProfile.bookings.reduce((acc, b) => acc + (b.durationMins / 60), 0);
    
    // Unique students count
    const studentIds = new Set(mentorProfile.bookings.map(b => b.studentId));
    const guidedStudents = studentIds.size;

    // Calculate actual average rating
    let averageRating = "0.0";
    if (mentorProfile.reviews.length > 0) {
      const sum = mentorProfile.reviews.reduce((acc, rev) => acc + rev.rating, 0);
      averageRating = (sum / mentorProfile.reviews.length).toFixed(1);
    }

    return NextResponse.json({
      totalEarnings: totalEarnings.toFixed(2),
      guidedStudents,
      averageRating,
      totalHours: totalHours.toFixed(1),
      currency: mentorProfile.currency,
      isVerified: mentorProfile.isVerified,
      isStripeConnected: !!mentorProfile.stripeAccountId,
      recentBookings: mentorProfile.bookings.slice(0, 5).map(b => ({
        id: b.id,
        studentName: b.student.name || "Student",
        date: b.scheduledAt,
        status: b.status
      }))
    });
  } catch (error: unknown) {
    console.error("Fetch Mentor Stats Error:", error);
    return NextResponse.json({ error: "Failed to fetch mentor stats." }, { status: 500 });
  }
}
