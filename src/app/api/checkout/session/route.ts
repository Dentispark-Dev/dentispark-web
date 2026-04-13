import Stripe from "stripe";
import { NextResponse } from "next/server";
import prisma from "@/src/lib/db";

// Lazy-initialise the Stripe client so missing keys only crash at request time
const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set in environment variables.");
  return new Stripe(key, { apiVersion: "2023-10-16" });
};

export async function POST(req: Request) {
  try {
    const { mentorName, sessionType, price, mentorSlug, successUrl, cancelUrl } = await req.json();

    // Validate required fields
    if (!mentorName || !sessionType || price === undefined || !mentorSlug) {
      return NextResponse.json({ error: "Missing required booking fields." }, { status: 400 });
    }

    const stripe = getStripe();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // For free intro calls, skip Stripe and redirect directly
    if (price === 0) {
      return NextResponse.json({
        url: `${baseUrl}/mentorship/${mentorSlug}/booking-confirmed?session=${encodeURIComponent(sessionType)}&free=true`,
      });
    }

    // 1. Create a PENDING booking in our database first
    // Note: In production we use actual studentId/mentorId from auth & params
    // Here we use realistic mock fallback for the IDs to bypass complex auth setups
    const defaultStudent = await prisma.user.findFirst({ where: { role: "STUDENT" }});
    const defaultMentor = await prisma.mentorProfile.findFirst();
    
    // We only create this if we found valid DB records
    let bookingId = "";
    if (defaultStudent && defaultMentor) {
      const booking = await prisma.booking.create({
        data: {
          studentId: defaultStudent.id,
          mentorId: defaultMentor.id,
          scheduledAt: new Date(Date.now() + 86400000), // Tomorrow
          durationMins: 60,
          status: "PENDING",
        }
      });
      bookingId = booking.id;
    }

    // 2. Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: `${mentorName} — ${sessionType}`,
              description: `1-on-1 mentoring session via DentiSpark. 60 minutes.`,
            },
            unit_amount: Math.round(price * 100), // Stripe uses pence
          },
          quantity: 1,
        },
      ],
      success_url:
        successUrl ||
        `${baseUrl}/mentorship/${mentorSlug}/booking-confirmed?session=${encodeURIComponent(sessionType)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${baseUrl}/mentorship/${mentorSlug}`,
      metadata: {
        mentorSlug,
        sessionType,
        bookingId: bookingId || "mock_booking_123",
        platform: "dentispark",
      },
      // DentiSpark takes a 10% platform fee (requires Stripe Connect for mentor payouts)
      // payment_intent_data: {
      //   application_fee_amount: Math.round(price * 100 * 0.10),
      //   transfer_data: { destination: defaultMentor?.stripeAccountId || "acct_1234" },
      // },
    });

    // 3. Link the session to the DB booking
    if (bookingId) {
       await prisma.booking.update({
          where: { id: bookingId },
          data: { stripeSessionId: session.id }
       });
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create checkout session.";
    console.error("Stripe Checkout Error:", errorMessage);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
