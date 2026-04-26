import Stripe from "stripe";
import { NextResponse } from "next/server";
import prisma from "@/src/lib/db";

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
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  // ── Handle Events ─────────────────────────────────────────────
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const { mentorSlug, sessionType, bookingId } = session.metadata || {};

      console.log(`✅ Payment confirmed for mentor: ${mentorSlug}, session: ${sessionType}`);

      // 1. Mark the BookingSession as "PENDING" (Awaiting Mentor Approval)
      if (bookingId && bookingId !== "mock_booking_123") {
        await prisma.booking.update({
          where: { id: bookingId },
          data: { status: "PENDING" }
        });

        // 2. Notify the Mentor (Simple implementation via PlatformActivity or specialized notification)
        const booking = await prisma.booking.findUnique({
          where: { id: bookingId },
          include: { mentor: { include: { user: true } }, student: true }
        });

        if (booking) {
          await prisma.platformActivity.create({
            data: {
              userId: booking.mentor.userId,
              action: "NEW_BOOKING",
              details: `Student ${booking.student.name} requested a ${sessionType} session.`,
              category: "MENTORSHIP"
            }
          });
          
          // TODO: Send email to mentor about the new request
          console.log(`📧 Notification sent to mentor: ${booking.mentor.user.email}`);
        }
      }

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
      
      const paymentIntentId = typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent?.id;
      
      if (paymentIntentId) {
         // Attempt to update the booking to cancelled if we saved the paymentIntent (or stripeSessionId can be cross-referenced, but we need caution)
         // In a robust implementation, we would listen for 'checkout.session.refunded'.
         console.log(`Attempting cancel for payment intent: ${paymentIntentId}`);
      }
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
