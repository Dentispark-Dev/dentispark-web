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

    return NextResponse.json({
      totalEarnings: totalEarnings.toFixed(2),
      guidedStudents,
      averageRating: "4.9", // Placeholder until Review model is added
      totalHours: totalHours.toFixed(1),
      currency: mentorProfile.currency,
      recentBookings: mentorProfile.bookings.slice(0, 5).map(b => ({
        id: b.id,
        studentName: b.student.name || "Student",
        date: b.scheduledAt,
        status: b.status
      }))
    });
  } catch (error: any) {
    console.error("Fetch Mentor Stats Error:", error);
    return NextResponse.json({ error: "Failed to fetch mentor stats." }, { status: 500 });
  }
}
