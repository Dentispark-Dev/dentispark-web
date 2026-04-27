import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/lib/db";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.dentispark.com";

/**
 * Prisma-first proxy for all backend API requests.
 *
 * Architecture:
 *  - Students → served entirely from local Prisma DB (synced on first access)
 *  - Mentors  → served entirely from local Prisma DB
 *  - Everything else → forwarded to the Java backend with auth headers injected
 *
 * Deletions write deletedAt to the User row; all queries filter deletedAt IS NULL.
 * The old DeletedLegacyUser band-aid has been removed.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Helper: build Java-facing headers
// ─────────────────────────────────────────────────────────────────────────────
function buildHeaders(request: NextRequest, requestId: string, includeBody = false) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const channelId   = process.env.NEXT_PUBLIC_CHANNEL_ID;
  const channelSecret = process.env.NEXT_PUBLIC_CHANNEL_SECRET;

  const headers: Record<string, string> = {
    "Accept":       "application/json",
    "User-Agent":   request.headers.get("user-agent") || "DentiSpark-Proxy/1.0",
    "X-Request-ID": requestId,
  };
  const origin  = request.headers.get("origin");
  const referer = request.headers.get("referer");
  if (origin)  headers["Origin"]  = origin;
  if (referer) headers["Referer"] = referer;
  if (includeBody) headers["Content-Type"] = request.headers.get("content-type") || "application/json";
  if (accessToken)  headers["Authorization"] = `Bearer ${accessToken}`;
  if (channelId)    headers["Channel-ID"]    = channelId;
  if (channelSecret) headers["Channel-Secret"] = channelSecret;
  return headers;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: standard paginated Prisma-list response
// ─────────────────────────────────────────────────────────────────────────────
function paginatedResponse(content: unknown[], total: number, page: number, pageSize: number) {
  const totalPages = Math.ceil(total / pageSize) || 1;
  return NextResponse.json({
    content,
    pageable:         { pageNumber: page, pageSize },
    last:             page >= totalPages - 1,
    totalElements:    total,
    totalPages,
    size:             pageSize,
    number:           page,
    sort:             { empty: false, sorted: true, unsorted: false },
    first:            page === 0,
    numberOfElements: content.length,
    empty:            content.length === 0,
  }, { status: 200, headers: { "X-Source": "Prisma" } });
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERCEPT: student/records — fast Prisma-first, no inline seeding
// ─────────────────────────────────────────────────────────────────────────────
async function handleStudentRecords(request: NextRequest): Promise<NextResponse> {
  const urlParams    = new URL(request.url).searchParams;
  const page         = parseInt(urlParams.get("pageNumber") || urlParams.get("page") || "0");
  const pageSize     = parseInt(urlParams.get("pageSize")  || urlParams.get("perPage") || "10");
  const searchKey    = (urlParams.get("searchKey") || "").toLowerCase().trim();
  const statusFilter = urlParams.get("activationStatus") || null;

  const where: Record<string, unknown> = { role: "STUDENT", deletedAt: null };
  if (searchKey) {
    where["OR"] = [
      { firstName: { contains: searchKey, mode: "insensitive" } },
      { lastName:  { contains: searchKey, mode: "insensitive" } },
      { email:     { contains: searchKey, mode: "insensitive" } },
      { sid:       { contains: searchKey, mode: "insensitive" } },
      { name:      { contains: searchKey, mode: "insensitive" } },
    ];
  }
  if (statusFilter) where["activationStatus"] = statusFilter;

  const [students, total] = await Promise.all([
    prisma.user.findMany({
      where, orderBy: { createdAt: "desc" }, skip: page * pageSize, take: pageSize,
    }),
    prisma.user.count({ where }),
  ]);

  const content = students.map(s => ({
    sid:              s.sid || s.id,
    hid:              s.id,
    emailAddress:     s.email,
    firstName:        s.firstName,
    lastName:         s.lastName,
    name:             s.name,
    activationStatus: s.activationStatus,
    dentalSchoolGateway: s.gateway || "Standard Entry",
    currentAcademicYear: s.memberCategory || null,
    dateStamped:      s.createdAt.toISOString(),
    paymentStatus:    s.paymentStatus,
  }));

  // Also fetch ALL-time count (including deleted) to know if a sync has ever happened
  const totalEver = await prisma.user.count({ where: { role: "STUDENT" } });
  const needsSync = totalEver === 0; // true only if DB has literally no student records ever

  console.log(`[Prisma] Serving ${content.length}/${total} students (page ${page}, needsSync=${needsSync})`);

  const totalPages = Math.ceil(total / pageSize) || 1;
  return NextResponse.json({
    content,
    pageable:         { pageNumber: page, pageSize },
    last:             page >= totalPages - 1,
    totalElements:    total,
    totalPages,
    size:             pageSize,
    number:           page,
    sort:             { empty: false, sorted: true, unsorted: false },
    first:            page === 0,
    numberOfElements: content.length,
    empty:            content.length === 0,
    needsSync,        // UI reads this to show the "Sync from Java" banner
  }, { status: 200, headers: { "X-Source": "Prisma" } });
}



// ─────────────────────────────────────────────────────────────────────────────
// INTERCEPT: mentor/records — fully served from Prisma
// ─────────────────────────────────────────────────────────────────────────────
async function handleMentorRecords(request: NextRequest): Promise<NextResponse> {
  const urlParams    = new URL(request.url).searchParams;
  const page         = parseInt(urlParams.get("pageNumber") || urlParams.get("page") || "0");
  const pageSize     = parseInt(urlParams.get("pageSize")   || urlParams.get("perPage") || "10");
  const searchKey    = (urlParams.get("searchKey") || "").toLowerCase();
  const verifiedParam = urlParams.get("verified");

  const where: Record<string, unknown> = {
    role:      "MENTOR",
    deletedAt: null,
  };
  if (searchKey) {
    where["OR"] = [
      { name:      { contains: searchKey, mode: "insensitive" } },
      { firstName: { contains: searchKey, mode: "insensitive" } },
      { lastName:  { contains: searchKey, mode: "insensitive" } },
      { email:     { contains: searchKey, mode: "insensitive" } },
    ];
  }

  const [mentors, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include:  { mentorProfile: true },
      orderBy:  { createdAt: "desc" },
      skip:     page * pageSize,
      take:     pageSize,
    }),
    prisma.user.count({ where }),
  ]);

  let content = mentors.map(m => ({
    sid:                 m.sid || m.id,
    hid:                 m.id,
    emailAddress:        m.email,
    firstName:           m.firstName,
    lastName:            m.lastName,
    mentorName:          m.name,
    activationStatus:    m.activationStatus,
    dentalSchoolGateway: m.gateway || "General Dentistry",
    verified:            m.mentorProfile?.isVerified || false,
    dateStamped:         m.createdAt.toISOString(),
  }));

  if (verifiedParam !== null) {
    const isVer = verifiedParam === "true";
    content = content.filter(m => m.verified === isVer);
  }

  console.log(`[Prisma] Serving ${content.length}/${total} mentors (page ${page})`);
  return paginatedResponse(content, content.length, page, pageSize);
}

// ─────────────────────────────────────────────────────────────────────────────
// Main proxy — forward to Java
// ─────────────────────────────────────────────────────────────────────────────
export async function proxyRequest(request: NextRequest, pathSegments: string[]) {
  const requestId  = Math.random().toString(36).substring(7);
  const backendPath = pathSegments.join("/");
  const url        = new URL(request.url);
  const queryString = url.search;
  const backendUrl  = `${API_URL}/${backendPath}${queryString}`;
  const isGet       = request.method === "GET";

  try {
    // ── Prisma intercepts ─────────────────────────────────────────────────
    if (isGet && backendPath.includes("students/records")) {
      return await handleStudentRecords(request);
    }
    if (isGet && backendPath.includes("mentors/records")) {
      return await handleMentorRecords(request);
    }

    // ── Forward to Java ───────────────────────────────────────────────────
    const headers = buildHeaders(request, requestId, !isGet);
    let body: ArrayBuffer | undefined;
    if (!isGet) {
      try { body = await request.arrayBuffer(); } catch { /* empty body */ }
    }

    const response = await fetch(backendUrl, { method: request.method, headers, body, cache: "no-store" });

    const contentType = response.headers.get("content-type");
    const responseHeaders: Record<string, string> = {
      "X-Proxy-Request-ID": requestId,
      "X-Backend-Status":   response.status.toString(),
      "X-Proxied-To-Java":  "true",
    };
    if (contentType) responseHeaders["Content-Type"] = contentType;

    return new NextResponse(await response.arrayBuffer(), { status: response.status, headers: responseHeaders });

  } catch (error: any) {
    console.error(`[Backend Proxy Error] [${requestId}]`, error);
    return NextResponse.json(
      { responseCode: "ERROR", responseMessage: "Proxy error occurred", errors: [error.message || "Unknown error"], requestId },
      { status: 502, headers: { "X-Proxy-Error": "true", "X-Proxy-Request-ID": requestId } }
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Route handlers
// ─────────────────────────────────────────────────────────────────────────────
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

  // For student/mentor deletes: soft-delete the Prisma record directly.
  // This is the authoritative delete — Java is also called for sync but Prisma is truth.
  const backendPath = path.join("/");
  const lastSegment = decodeURIComponent(path[path.length - 1] || "").trim();

  if (lastSegment && lastSegment !== "records") {
    const isStudentDelete = backendPath.includes("student");
    const isMentorDelete  = backendPath.includes("mentor");

    if (isStudentDelete || isMentorDelete) {
      try {
        // Find by SID or internal ID
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { sid: lastSegment },
              { id:  lastSegment },
              { email: { equals: lastSegment, mode: "insensitive" } },
            ],
          },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data:  { deletedAt: new Date() },
          });
          console.log(`[Prisma DELETE] Soft-deleted user: ${user.email} (${user.sid || user.id})`);
        }
      } catch (e) {
        console.error("[Prisma DELETE] Soft-delete failed:", e);
      }
    }
  }

  // Also forward to Java for legacy sync (fire and forget)
  return proxyRequest(request, path);
}
