import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.dentispark.com";

/**
 * Catch-all server-side proxy for ALL backend API requests.
 *
 * This replaces the previous next.config.ts rewrite rule which was unable to
 * reliably forward Channel-ID / Channel-Secret / Authorization headers,
 * causing the Java backend to reject requests with Code 96 ("One of
 * Channel-ID or Channel-Secret") or Code 95 ("Security issue detected").
 *
 * Every HTTP method:
 *  1. Reads the accessToken from the HttpOnly cookie
 *  2. Injects Channel-ID, Channel-Secret, and Authorization headers
 *  3. Forwards the request (including body + query params) to the Java backend
 *  4. Returns the backend response to the browser
 */
async function proxyRequest(request: NextRequest, pathSegments: string[]) {
  try {
    const backendPath = pathSegments.join("/");

    // Preserve the original query string
    const url = new URL(request.url);
    const queryString = url.search; // includes the leading '?'

    const backendUrl = `${API_URL}/${backendPath}${queryString}`;

    // Build headers — this is the critical part the rewrite was missing
    const accessToken = request.cookies.get("accessToken")?.value;
    const channelId = process.env.NEXT_PUBLIC_CHANNEL_ID;
    const channelSecret = process.env.NEXT_PUBLIC_CHANNEL_SECRET;
    const headers: Record<string, string> = {
      Accept: "application/json",
    };

    // Only include Content-Type if we are sending a body
    if (!["GET", "HEAD"].includes(request.method)) {
      headers["Content-Type"] = request.headers.get("content-type") || "application/json";
    }

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // Use standard Title-Case headers as expected by the Java backend security filters.
    // We remove the lowercase duplicates to prevent "multiple header values" errors.
    if (channelId) headers["Channel-ID"] = channelId;
    if (channelSecret) headers["Channel-Secret"] = channelSecret;

    // Forward the body for non-GET/HEAD methods
    let body: BodyInit | undefined;
    if (!["GET", "HEAD"].includes(request.method)) {
      body = await request.text();
    }

    const response = await fetch(backendUrl, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    });

    // Read the response
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const responseBody = await response.text();
      return new NextResponse(responseBody, {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // Non-JSON (HTML error pages, etc.) — wrap in a structured JSON error
      const text = await response.text();
      console.error(`[Backend Proxy] Non-JSON from ${backendUrl}:`, text.substring(0, 200));
      return NextResponse.json(
        {
          responseCode: "ERROR",
          responseMessage: "Backend returned non-JSON response",
          errors: [],
        },
        { status: response.status === 200 ? 502 : response.status }
      );
    }
  } catch (error: any) {
    console.error("[Backend Proxy Error]", error);
    return NextResponse.json(
      {
        responseCode: "ERROR",
        responseMessage: "Proxy error",
        errors: [error.message || "Unknown error"],
      },
      { status: 502 }
    );
  }
}

// Next.js 15 uses async params
type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { path } = await params;
  return proxyRequest(request, path);
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const { path } = await params;
  return proxyRequest(request, path);
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { path } = await params;
  return proxyRequest(request, path);
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { path } = await params;
  return proxyRequest(request, path);
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const { path } = await params;
  return proxyRequest(request, path);
}
