import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query } from "@/src/lib/db";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const userDataCookie = cookieStore.get("userData")?.value;

  if (!accessToken || !userDataCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let user;
  try {
    user = JSON.parse(userDataCookie);
  } catch (e) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  try {
    const { bookingId, rating, comment } = await req.json();

    if (!bookingId || !rating) {
      return NextResponse.json({ error: "Booking ID and Rating are required." }, { status: 400 });
    }

    // Use a transaction to ensure data consistency
    await query("BEGIN");

    // 1. Mark the Booking record as 'reviewed'
    await query(
      "UPDATE mentorship_bookings SET status = 'reviewed' WHERE id = $1",
      [bookingId]
    );

    // 2. Create the Review record
    const mentorResult = await query(
      "SELECT mentor_slug FROM mentorship_bookings WHERE id = $1",
      [bookingId]
    );
    const mentorSlug = mentorResult.rows[0]?.mentor_slug;

    await query(
      `INSERT INTO mentorship_reviews (booking_id, mentor_slug, student_id, rating, comment, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [bookingId, mentorSlug, user.id, rating, comment]
    );

    // 3. Recalculate and Update Mentor aggregates
    if (mentorSlug) {
      await query(
        `UPDATE mentors 
         SET average_rating = (SELECT AVG(rating) FROM mentorship_reviews WHERE mentor_slug = $1),
             total_reviews = (SELECT COUNT(*) FROM mentorship_reviews WHERE mentor_slug = $1)
         WHERE slug = $1`,
        [mentorSlug]
      );
    }

    await query("COMMIT");

    console.log(`[Review Submitted] Booking: ${bookingId}, Rating: ${rating}, Comment: ${comment}`);

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully"
    });
  } catch (error: unknown) {
    try {
      await query("ROLLBACK");
    } catch (e) {
      // Ignore rollback errors if transaction wasn't started
    }
    console.error("Review API Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred submitting the review." },
      { status: 500 }
    );
  }
}
