import { NextResponse } from "next/server";
import prisma from "@/src/lib/db";

const DAILY_API_KEY = process.env.DAILY_API_KEY;
const DAILY_BASE_URL = "https://api.daily.co/v1";

export async function POST(req: Request) {
  if (!DAILY_API_KEY) {
    return NextResponse.json(
      { error: "Video conferencing is not configured. DAILY_API_KEY missing." },
      { status: 500 }
    );
  }

  try {
    const { mentorSlug, sessionType, bookingId } = await req.json();

    if (!mentorSlug || !bookingId) {
      return NextResponse.json({ error: "mentorSlug and bookingId are required." }, { status: 400 });
    }

    // Generate a clean, unique room name
    const roomName = `dentispark-${mentorSlug}-${bookingId}`.toLowerCase().replace(/[^a-z0-9-]/g, "-");

    // Call Daily.co REST API to create a private video room
    const response = await fetch(`${DAILY_BASE_URL}/rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DAILY_API_KEY}`,
      },
      body: JSON.stringify({
        name: roomName,
        privacy: "private", // Requires a meeting token to join
        properties: {
          max_participants: 2,              // 1 student + 1 mentor
          enable_screenshare: true,         // Useful for PS review sessions
          enable_chat: true,
          enable_knocking: true,            // Mentor must admit student
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 3, // Expires 3hrs from now
          eject_at_room_exp: true,
          // Meeting name shown in the UI
          meeting_joindata: { session_type: sessionType, platform: "DentiSpark" },
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Daily.co room creation failed:", errorBody);
      return NextResponse.json({ error: "Failed to create video room." }, { status: 502 });
    }

    const room = await response.json();

    const videoLink = room.url;

    // Persist this videoLink to the Booking in PostgreSQL via Prisma
    if (bookingId && bookingId !== "mock_booking_123") {
        await prisma.booking.update({
          where: { id: bookingId },
          data: { meetingLink: videoLink }
        });
    }

    // TODO: Email the link to both the student and mentor (via Resend)

    return NextResponse.json({
      roomName: room.name,
      videoLink,
      expiresAt: new Date(room.config.exp * 1000).toISOString(),
    });
  } catch (error: unknown) {
    console.error("Video Room API Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred creating the video room." },
      { status: 500 }
    );
  }
}
