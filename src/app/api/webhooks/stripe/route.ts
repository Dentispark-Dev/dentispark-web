import Stripe from "stripe";
import { NextResponse } from "next/server";

const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set.");
  return new Stripe(key, { apiVersion: "2023-10-16" });
};

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured." }, { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  // ── Handle Events ─────────────────────────────────────────────
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const { mentorSlug, sessionType } = session.metadata || {};

      console.log(`✅ Payment confirmed for mentor: ${mentorSlug}, session: ${sessionType}`);

      // TODO: Wire this to your Contabo Database:
      // 1. Mark the BookingSession as "confirmed"
      // 2. Generate the video room link (Daily.co API)
      // 3. Send confirmation email to student + mentor (via Resend/Sendgrid)
      // 4. Create calendar event (Google Calendar API)

      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.error(`❌ Payment failed for intent: ${paymentIntent.id}`);
      // TODO: Notify the student their payment failed. Retry flow.
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      console.log(`💸 Refund processed for charge: ${charge.id}`);
      // TODO: Cancel the associated BookingSession in the DB.
      break;
    }

    default:
      // Unhandled events — safe to ignore
      break;
  }

  return NextResponse.json({ received: true });
}

// Required: disable body parsing so Stripe signature verification works
export const config = {
  api: {
    bodyParser: false,
  },
};
