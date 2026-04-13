import { NextResponse } from "next/server";

/**
 * Backend API shells for Stripe Connect integration.
 * To be integrated with the DentiSpark Admin Dashboard.
 */

// GET /api/admin/payments/stripe - Get account status
export async function GET() {
  try {
    // TODO: Fetch account ID from DB or environment
    // const account = await stripe.accounts.retrieve(accountId);
    
    return NextResponse.json({
      isConnected: false,
      status: "pending_onboarding",
      details_submitted: false,
      charges_enabled: false,
      payouts_enabled: false,
      requirements: {
          currently_due: ["external_account", "tos_acceptance"]
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stripe status" }, { status: 500 });
  }
}

// POST /api/admin/payments/stripe - Create account link for onboarding
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mentorId } = body;

    if (!mentorId) {
        return NextResponse.json({ error: "mentorId is required" }, { status: 400 });
    }

    // TODO: Implement Stripe Connect Account Link creation
    /*
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: 'https://www.dentispark.com/mentor/settings/payouts/reauth',
      return_url: 'https://www.dentispark.com/mentor/settings/payouts/complete',
      type: 'account_onboarding',
    });
    */

    return NextResponse.json({
      url: "https://connect.stripe.com/setup/s/placeholder_link",
      success: true
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create onboarding link" }, { status: 500 });
  }
}

// PATCH /api/admin/payments/stripe - Update payout settings
export async function PATCH() {
    return NextResponse.json({ message: "Function shell ready for integration" });
}
