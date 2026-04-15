import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("accessToken")?.value;
    const channelId = process.env.NEXT_PUBLIC_CHANNEL_ID;
    const channelSecret = process.env.NEXT_PUBLIC_CHANNEL_SECRET;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.dentispark.com";

    console.log("[Dashboard Proxy] Fetching summary with headers...");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    if (channelId) headers["Channel-ID"] = channelId;
    if (channelSecret) headers["Channel-Secret"] = channelSecret;

    // Direct server-to-server call bypasses the browser's origin/CORS context
    const response = await fetch(`${apiUrl}/dashboard/summary`, {
      method: "GET",
      headers,
      cache: 'no-store' // Ensure we get fresh data
    });

    const contentType = response.headers.get("content-type");
    let data;
    
    if (contentType && contentType.includes("application/json")) {
        data = await response.json();
    } else {
        const text = await response.text();
        console.error("[Dashboard Proxy] Received non-JSON response:", text.substring(0, 100));
        return NextResponse.json({
            responseCode: "ERROR",
            responseMessage: "Backend returned non-JSON response",
            success: false
        }, { status: response.status === 200 ? 502 : response.status });
    }

    if (!response.ok) {
        console.error("[Dashboard Proxy] Backend error:", response.status, data);
        return NextResponse.json(data || { message: "Unknown backend error" }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[Dashboard Proxy Error]", error);
    return NextResponse.json({
      responseCode: "ERROR",
      responseMessage: "Failed to proxy dashboard summary",
      errors: [error.message || "Unknown error"],
      success: false
    }, { status: 500 });
  }
}
