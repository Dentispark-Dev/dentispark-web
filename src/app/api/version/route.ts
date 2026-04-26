import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    version: "1.0.5",
    timestamp: new Date().toISOString(),
    status: "online",
    db_configured: !!process.env.DATABASE_URL,
    local_auth: process.env.NEXT_PUBLIC_USE_LOCAL_AUTH === "true",
    channel_id: !!process.env.NEXT_PUBLIC_CHANNEL_ID
  });
}
