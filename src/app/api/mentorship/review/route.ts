import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/src/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { bookingId, rating, comment } = await req.json();

    if (!bookingId || !rating) {
      return NextResponse.json({ error: "Booking ID and Rating are required." }, { status: 400 });
    }

    // TODO: Update the specific Booking record status to 'reviewed'
    // await db.booking.update({ where: { id: bookingId }, data: { status: 'reviewed' } });

    // TODO: Create a new Review record in the Contabo DB
    // await db.review.create({
    //   data: {
    //     bookingId,
    //     rating,
    //     comment,
    //     studentId: session.user.id,
    //     createdAt: new Date().toISOString()
    //   }
    // });

    // TODO: Recalculate and Update Mentor's averageRating and totalReviews
    // await updateMentorAggregates(mentorId);

    console.log(`[Review Submitted] Booking: ${bookingId}, Rating: ${rating}, Comment: ${comment}`);

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully"
    });
  } catch (error: any) {
    console.error("Review API Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred submitting the review." },
      { status: 500 }
    );
  }
}
