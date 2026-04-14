import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("pageNumber") || "0";
    const size = searchParams.get("pageSize") || "10";
    
    const accessToken = request.cookies.get("accessToken")?.value;
    const channelId = process.env.NEXT_PUBLIC_CHANNEL_ID;
    const channelSecret = process.env.NEXT_PUBLIC_CHANNEL_SECRET;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.dentispark.com";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    if (channelId) headers["Channel-ID"] = channelId;
    if (channelSecret) headers["Channel-Secret"] = channelSecret;

    // Proxy the request to the Java backend
    const response = await fetch(`${apiUrl}/dashboard/global-activity?pageNumber=${page}&pageSize=${size}`, {
      method: "GET",
      headers,
      cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("[Global Activity Proxy] Backend error:", response.status, data);
        return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[Global Activity Proxy Error]", error);
    return NextResponse.json({
      responseCode: "ERROR",
      responseMessage: "Failed to proxy global activity",
      errors: [error.message || "Unknown error"],
      success: false
    }, { status: 500 });
  }
}
