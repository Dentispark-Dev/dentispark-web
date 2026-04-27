import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/lib/db";

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

    // INTERCEPT DELETED PROFILES BEFORE CALLING JAVA (Local Hide Feature)
    // If the path contains an identifier that we've locally hidden, return 404 immediately.
    const lastSegment = pathSegments[pathSegments.length - 1];
    if (lastSegment && lastSegment !== "records" && request.method === "GET") {
        const decodedSegment = decodeURIComponent(lastSegment).trim().toLowerCase();
        try {
            const hiddenUser = await prisma.deletedLegacyUser.findFirst({
                where: { identifier: { equals: decodedSegment, mode: 'insensitive' } }
            });
            
            if (hiddenUser) {
                console.log(`[Proxy] Blocked access to locally hidden user: ${decodedSegment}`);
                return NextResponse.json({
                    responseCode: "404",
                    responseMessage: "Account not found or has been archived.",
                    message: "Account not found or has been archived.",
                    errors: []
                }, { status: 404, headers: { "X-Local-Hide": "true" } });
            }
        } catch (e) {
            console.error("[Proxy Filter Error] Pre-flight check failed:", e);
        }
    }

    // INTERCEPT MENTOR RECORDS: Serve exclusively from local Prisma database
    if (backendPath.includes("mentors/records") && request.method === "GET") {
        try {
            const prismaMentors = await prisma.user.findMany({
                where: { role: "MENTOR" },
                include: { mentorProfile: true },
                orderBy: { createdAt: 'desc' }
            });
            
            const formattedPrismaMentors = prismaMentors.map(m => ({
                sid: m.sid || m.id,
                hid: m.id,
                emailAddress: m.email,
                firstName: m.firstName,
                lastName: m.lastName,
                mentorName: m.name,
                activationStatus: m.activationStatus,
                dentalSchoolGateway: m.gateway || "General Dentistry",
                verified: m.mentorProfile?.isVerified || false,
                dateStamped: m.createdAt.toISOString()
            }));

            // Handle basic pagination via query params
            const urlParams = new URL(request.url).searchParams;
            const page = parseInt(urlParams.get("pageNumber") || urlParams.get("page") || "0");
            const pageSize = parseInt(urlParams.get("pageSize") || urlParams.get("perPage") || "10");
            
            const searchKey = (urlParams.get("searchKey") || "").toLowerCase();
            const verifiedParam = urlParams.get("verified");
            
            // Filter by searchKey
            let filteredMentors = formattedPrismaMentors;
            if (searchKey) {
                filteredMentors = filteredMentors.filter(m => 
                    (m.mentorName && m.mentorName.toLowerCase().includes(searchKey)) ||
                    (m.emailAddress && m.emailAddress.toLowerCase().includes(searchKey)) ||
                    (m.hid && m.hid.toLowerCase().includes(searchKey))
                );
            }
            
            // Filter by verified
            if (verifiedParam !== null) {
                const isVer = verifiedParam === 'true';
                filteredMentors = filteredMentors.filter(m => m.verified === isVer);
            }

            const totalElements = filteredMentors.length;
            const totalPages = Math.ceil(totalElements / pageSize);
            const content = filteredMentors.slice(page * pageSize, (page + 1) * pageSize);

            console.log(`[Proxy Intercept] Serving ${content.length} mentors from Prisma (Total: ${totalElements})`);

            return NextResponse.json({
                content,
                pageable: { pageNumber: page, pageSize: pageSize },
                last: page >= totalPages - 1,
                totalElements,
                totalPages,
                size: pageSize,
                number: page,
                sort: { empty: false, sorted: true, unsorted: false },
                first: page === 0,
                numberOfElements: content.length,
                empty: content.length === 0
            }, { status: 200, headers: { "X-Proxied-To-Java": "false", "X-Source": "Prisma" } });
        } catch (e) {
            console.error("[Proxy Merge Error] Failed to fetch Prisma mentors:", e);
            // Fallback to Java if Prisma fails
        }
    }

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
          const hiddenSet = new Set(hiddenUsers.map(u => String(u.identifier).trim().toLowerCase()));

          if (hiddenSet.size > 0) {
            const originalLength = json.content.length;
            json.content = json.content.filter((item: any) => {
              const sid = String(item.sid || '').trim().toLowerCase();
              const hid = String(item.hid || '').trim().toLowerCase();
              const email = String(item.emailAddress || '').trim().toLowerCase();
              
              const isHidden = hiddenSet.has(sid) || hiddenSet.has(hid) || hiddenSet.has(email);
              if (isHidden) {
                  console.log(`[Proxy Filter] HIDING user: sid=${sid}, hid=${hid}, email=${email}`);
              }
              return !isHidden;
            });
            
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
  const response = await proxyRequest(request, path);

  // After a successful DELETE, persist the identifier to the local hidden-user filter
  // so the record is immediately removed from all list and detail views.
  if (response.status === 200 || response.status === 204) {
    try {
      const lastSegment = decodeURIComponent(path[path.length - 1] || "").trim();
      if (lastSegment && lastSegment !== "records") {
        // Determine type from path
        const pathStr = path.join("/").toLowerCase();
        const type = pathStr.includes("mentor") ? "MENTOR" : "STUDENT";

        await prisma.deletedLegacyUser.upsert({
          where: { identifier: lastSegment },
          update: {},
          create: { identifier: lastSegment, type },
        });
        // Also try to add the lowercase version for email-based lookups
        const lower = lastSegment.toLowerCase();
        if (lower !== lastSegment) {
          await prisma.deletedLegacyUser.upsert({
            where: { identifier: lower },
            update: {},
            create: { identifier: lower, type },
          });
        }
        console.log(`[Proxy DELETE] Auto-hidden: ${lastSegment} (${type})`);
      }
    } catch (e) {
      console.error("[Proxy DELETE] Failed to persist hidden user:", e);
    }
  }

  return response;
}
