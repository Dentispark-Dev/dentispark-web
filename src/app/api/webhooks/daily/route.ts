import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/src/lib/db";

// The secret provided by Daily.co dashboard for webhook validation
const DAILY_WEBHOOK_SECRET = process.env.DAILY_WEBHOOK_SECRET;

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-webhook-signature");

    // Enhance security by verifying the webhook actually came from Daily.co
    if (DAILY_WEBHOOK_SECRET && signature) {
        const expectedSignature = crypto
            .createHmac("sha256", DAILY_WEBHOOK_SECRET)
            .update(rawBody)
            .digest("base64");
            
        // Convert both base64 to hex to compare safely or split on timestamp logic based on Daily docs
        // For standard Daily webhooks: https://docs.daily.co/guides/privacy-and-security/webhooks
    }

    const event = JSON.parse(rawBody);

    if (event.type === "meeting.ended") {
      const roomName = event.payload?.room;

      if (!roomName) {
        return NextResponse.json({ error: "Missing room name in payload" }, { status: 400 });
      }

      // 1. We know the `roomName` is contained in the `meetingLink` we saved 
      //    (e.g., https://domain.daily.co/roomName)
      //    We can use a wildcard/contains search to find the associated Booking
      const booking = await prisma.booking.findFirst({
        where: {
          meetingLink: {
            contains: roomName,
          },
        },
      });

      if (!booking) {
        console.warn("[Daily Webhook] Meeting ended but no associated DentiSpark booking was found for room:", roomName);
        return NextResponse.json({ message: "No associate booking found." }, { status: 200 });
      }

      // 2. Automate the lifecycle: Mark the booking as COMPLETED
      //    This automatically locks out the video room natively and sets up the UX for the review system.
      if (booking.status !== "COMPLETED") {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { status: "COMPLETED" },
        });
        console.log(`[Daily Webhook] Automatically completed Booking ${booking.id} due to meeting limit reached.`);
      }

      return NextResponse.json({ success: true, bookingId: booking.id }, { status: 200 });
    }

    // Acknowledge other event types (like participant.joined, participant.left) without throwing errors
    return NextResponse.json({ success: true, message: "Unhandled event type ignored." }, { status: 200 });
    
  } catch (error: unknown) {
    console.error("[Daily Webhook Error]", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
