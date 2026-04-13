import Stripe from "stripe";
import { NextResponse } from "next/server";
import prisma from "@/src/lib/db";

const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set.");
  return new Stripe(key, { apiVersion: "2023-10-16" });
};

export async function POST(req: Request) {
  try {
    const stripe = getStripe();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // In a real app, retrieve the actual user session/token
    // For this prototype, fetch a mock MentorProfile to simulate
    const mentorProfile = await prisma.mentorProfile.findFirst({
        include: { user: true }
    });

    if (!mentorProfile) {
      return NextResponse.json({ error: "Mentor profile not found" }, { status: 404 });
    }

    let accountId = mentorProfile.stripeAccountId;

    // If the mentor doesn't have a Stripe Connect account, create one
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        email: mentorProfile.user.email || undefined,
        capabilities: {
          transfers: { requested: true },
        },
        business_type: "individual",
      });
      accountId = account.id;

      // Save Stripe Account ID to DB
      await prisma.mentorProfile.update({
        where: { id: mentorProfile.id },
        data: { stripeAccountId: accountId },
      });
    }

    // Generate the Account Link URL for KYC onboarding
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${baseUrl}/api/mentor/stripe/callback?status=refresh`,
      return_url: `${baseUrl}/api/mentor/stripe/callback?status=success`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error: unknown) {
    console.error("Stripe Connect Onboarding Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate Stripe onboarding link";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
