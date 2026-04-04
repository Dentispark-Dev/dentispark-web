import Stripe from "stripe";
import { NextResponse } from "next/server";

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

    // Create a Stripe Checkout Session
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
        platform: "dentispark",
      },
      // DentiSpark takes a 10% platform fee (requires Stripe Connect for mentor payouts)
      // payment_intent_data: {
      //   application_fee_amount: Math.round(price * 100 * 0.10),
      //   transfer_data: { destination: mentor.stripeAccountId },
      // },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error?.message);
    return NextResponse.json(
      { error: error?.message || "Failed to create checkout session." },
      { status: 500 }
    );
  }
}
