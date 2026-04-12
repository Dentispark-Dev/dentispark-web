import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  // Determine redirection back to mentor settings
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  
  if (status === "success") {
    // Redirect to the dashboard settings page with success param
    // The frontend should read this and trigger a re-check of connection status
    return NextResponse.redirect(`${baseUrl}/mentor/settings?stripe_status=connected`);
  } else if (status === "refresh") {
    // Stripe onboarding timed out or was interrupted
    return NextResponse.redirect(`${baseUrl}/mentor/settings?stripe_status=interrupted`);
  } else {
    return NextResponse.redirect(`${baseUrl}/mentor/settings`);
  }
}
