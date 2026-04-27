import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/lib/db";

const API_URL   = process.env.NEXT_PUBLIC_API_URL   || "https://api.dentispark.com";
const CHANNEL_ID     = process.env.NEXT_PUBLIC_CHANNEL_ID     || "";
const CHANNEL_SECRET = process.env.NEXT_PUBLIC_CHANNEL_SECRET || "";

/**
 * POST /api/admin/seed-students
 *
 * One-time (idempotent) migration that fetches all student pages from the
 * Java backend and upserts them into the local Prisma database.
 *
 * Safe to call multiple times — uses upsert on email (unique key).
 * Protect with a simple bearer token in the Authorization header equal to
 * SEED_SECRET env var (defaults to "dentispark-seed").
 */
export async function POST(request: NextRequest) {
  const seedSecret = process.env.SEED_SECRET || "dentispark-seed";
  const auth = request.headers.get("authorization") || "";
  if (auth !== `Bearer ${seedSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = request.cookies.get("accessToken")?.value;
  const headers: Record<string, string> = {
    "Accept":         "application/json",
    "User-Agent":     "DentiSpark-Seed/1.0",
    "Channel-ID":     CHANNEL_ID,
    "Channel-Secret": CHANNEL_SECRET,
  };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  let page = 0;
  const pageSize = 50;
  let totalSeeded = 0;
  let totalPages = 1;

  while (page < totalPages) {
    const res = await fetch(
      `${API_URL}/students/records?pageNumber=${page}&pageSize=${pageSize}`,
      { headers, cache: "no-store" }
    );

    if (!res.ok) {
      console.error(`[Seed] Java returned ${res.status} on page ${page}`);
      break;
    }

    const json = await res.json();
    totalPages = json.totalPages ?? 1;

    const students: any[] = json.content ?? [];
    for (const s of students) {
      if (!s.emailAddress) continue;
      try {
        await prisma.user.upsert({
          where:  { email: s.emailAddress },
          update: {
            sid:             s.sid || null,
            firstName:       s.firstName || null,
            lastName:        s.lastName  || null,
            name:            s.name || `${s.firstName || ""} ${s.lastName || ""}`.trim() || null,
            activationStatus: s.activationStatus || "ACTIVE",
            gateway:         s.dentalSchoolGateway || null,
            memberCategory:  s.currentAcademicYear ? String(s.currentAcademicYear) : null,
            role:            "STUDENT",
            deletedAt:       null,
          },
          create: {
            email:           s.emailAddress,
            sid:             s.sid || null,
            firstName:       s.firstName || null,
            lastName:        s.lastName  || null,
            name:            s.name || `${s.firstName || ""} ${s.lastName || ""}`.trim() || null,
            activationStatus: s.activationStatus || "ACTIVE",
            gateway:         s.dentalSchoolGateway || null,
            memberCategory:  s.currentAcademicYear ? String(s.currentAcademicYear) : null,
            role:            "STUDENT",
            deletedAt:       null,
          },
        });
        totalSeeded++;
      } catch (e) {
        console.error(`[Seed] Failed to upsert ${s.emailAddress}:`, e);
      }
    }

    console.log(`[Seed] Page ${page + 1}/${totalPages}: processed ${students.length} students`);
    page++;
  }

  return NextResponse.json({
    success: true,
    totalSeeded,
    message: `Successfully seeded ${totalSeeded} students into Prisma.`,
  });
}
