import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const device = searchParams.get("device");
    const location = searchParams.get("location");
    
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

    // Construct backend URL with query params
    const params = new URLSearchParams();
    if (device) params.append("device", device);
    if (location) params.append("location", location);
    const query = params.toString();
    const backendUrl = `${apiUrl}/dashboard/traffic${query ? `?${query}` : ""}`;

    console.log("[Traffic Proxy] Requesting:", backendUrl);

    // Proxy the request to the Java backend
    const response = await fetch(backendUrl, {
      method: "GET",
      headers,
      cache: 'no-store'
    });

    const contentType = response.headers.get("content-type");
    let data;
    
    if (contentType && contentType.includes("application/json")) {
        data = await response.json();
    } else {
        const text = await response.text();
        console.error("[Traffic Proxy] Received non-JSON response:", text.substring(0, 100));
        return NextResponse.json({
            responseCode: "ERROR",
            responseMessage: "Backend returned non-JSON response",
            success: false
        }, { status: response.status === 200 ? 502 : response.status });
    }

    if (!response.ok) {
        console.error("[Traffic Proxy] Backend error:", response.status, data);
        return NextResponse.json(data || { message: "Unknown backend error" }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[Traffic Proxy Error]", error);
    return NextResponse.json({
      responseCode: "ERROR",
      responseMessage: "Failed to proxy traffic analytics",
      errors: [error.message || "Unknown error"],
      success: false
    }, { status: 500 });
  }
}
