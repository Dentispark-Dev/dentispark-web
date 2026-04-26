import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

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
export async function proxyRequest(request: NextRequest, pathSegments: string[]) {
  const requestId = Math.random().toString(36).substring(7);
  try {
    const backendPath = pathSegments.join("/");

    // Preserve the original query string
    const url = new URL(request.url);
    const queryString = url.search;

    const backendUrl = `${API_URL}/${backendPath}${queryString}`;

    // Build headers
    const accessToken = request.cookies.get("accessToken")?.value;
    const channelId = process.env.NEXT_PUBLIC_CHANNEL_ID;
    const channelSecret = process.env.NEXT_PUBLIC_CHANNEL_SECRET;
    
    const headers: Record<string, string> = {
      "Accept": "application/json",
      "User-Agent": request.headers.get("user-agent") || "DentiSpark-Proxy/1.0",
      "X-Request-ID": requestId,
    };

    // Forward important security/context headers
    const origin = request.headers.get("origin");
    if (origin) headers["Origin"] = origin;
    
    const referer = request.headers.get("referer");
    if (referer) headers["Referer"] = referer;

    if (!["GET", "HEAD"].includes(request.method)) {
      headers["Content-Type"] = request.headers.get("content-type") || "application/json";
    }

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    if (channelId) headers["Channel-ID"] = channelId;
    if (channelSecret) headers["Channel-Secret"] = channelSecret;

    // Forward the body as ArrayBuffer to preserve binary data and encoding
    let body: ArrayBuffer | undefined;
    if (!["GET", "HEAD"].includes(request.method)) {
      try {
        body = await request.arrayBuffer();
      } catch (e) {
        // Body might be empty or unreadable
      }
    }

    const response = await fetch(backendUrl, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type");
    const responseHeaders: Record<string, string> = {
      "X-Proxy-Request-ID": requestId,
      "X-Backend-Status": response.status.toString(),
      "X-Proxied-To-Java": "true",
    };

    if (contentType) {
      responseHeaders["Content-Type"] = contentType;
    }

    // Read the response as ArrayBuffer to be safe with any content type
    let responseData = await response.arrayBuffer();

    // INTERCEPT AND FILTER LISTS (Local Hide Feature)
    if (response.ok && backendPath.endsWith("/records")) {
      try {
        const text = new TextDecoder().decode(responseData);
        const json = JSON.parse(text);

        if (json && Array.isArray(json.content)) {
          const hiddenUsers = await prisma.deletedLegacyUser.findMany({
            select: { identifier: true }
          });
          const hiddenSet = new Set(hiddenUsers.map(u => u.identifier));

          if (hiddenSet.size > 0) {
            const originalLength = json.content.length;
            json.content = json.content.filter((item: any) => 
              !hiddenSet.has(item.sid) && 
              !hiddenSet.has(item.hid) && 
              !hiddenSet.has(item.emailAddress)
            );
            
            // Adjust total count if we filtered something on this page
            const removedOnThisPage = originalLength - json.content.length;
            if (removedOnThisPage > 0) {
              json.totalElements = Math.max(0, (json.totalElements || 0) - removedOnThisPage);
            }

            const newText = JSON.stringify(json);
            responseData = new TextEncoder().encode(newText);
            
            // Log it for verification
            console.log(`[Proxy Filter] Removed ${removedOnThisPage} hidden records from ${backendPath}`);
          }
        }
      } catch (e) {
        console.error(`[Proxy Filter Error] Failed to filter records:`, e);
        // Continue with original data on error
      }
    }

    return new NextResponse(responseData, {
      status: response.status,
      headers: responseHeaders,
    });

  } catch (error: any) {
    console.error(`[Backend Proxy Error] [${requestId}]`, error);
    return NextResponse.json(
      {
        responseCode: "ERROR",
        responseMessage: "Proxy error occurred",
        errors: [error.message || "Unknown error"],
        requestId,
      },
      { 
        status: 502,
        headers: { "X-Proxy-Error": "true", "X-Proxy-Request-ID": requestId }
      }
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
