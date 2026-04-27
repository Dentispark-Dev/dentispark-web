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
      console.error(`[Seed Students] Java returned ${res.status} on page ${page}`);
      break;
    }

    const json = await res.json();
    // Java responses are wrapped in responseData
    const data = json.responseData || json;
    totalPages = data.totalPages ?? 1;

    const students: any[] = data.content ?? [];
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
        console.error(`[Seed Students] Failed to upsert ${s.emailAddress}:`, e);
      }
    }
    page++;
  }

  // --- Mentor Seeding ---
  let mentorPage = 0;
  let totalMentorsSeeded = 0;
  let totalMentorPages = 1;

  while (mentorPage < totalMentorPages) {
    try {
      const res = await fetch(
        `${API_URL}/mentors/records?pageNumber=${mentorPage}&pageSize=${pageSize}`,
        { headers, cache: "no-store" }
      );
      if (!res.ok) break;

      const json = await res.json();
      const data = json.responseData || json;
      totalMentorPages = data.totalPages ?? 1;

      const mentors: any[] = data.content ?? [];
      for (const m of mentors) {
        if (!m.emailAddress) continue;
        try {
          await prisma.user.upsert({
            where: { email: m.emailAddress },
            update: {
              sid:              m.sid || null,
              firstName:        m.firstName || null,
              lastName:         m.lastName || null,
              name:             m.name || m.mentorName || `${m.firstName || ""} ${m.lastName || ""}`.trim() || null,
              activationStatus: m.activationStatus || "ACTIVE",
              gateway:          m.dentalSchoolGateway || null,
              role:             "MENTOR",
              deletedAt:        null,
            },
            create: {
              email:            m.emailAddress,
              sid:              m.sid || null,
              firstName:        m.firstName || null,
              lastName:         m.lastName || null,
              name:             m.name || m.mentorName || `${m.firstName || ""} ${m.lastName || ""}`.trim() || null,
              activationStatus: m.activationStatus || "ACTIVE",
              gateway:          m.dentalSchoolGateway || null,
              role:             "MENTOR",
              deletedAt:        null,
            },
          });
          totalMentorsSeeded++;
        } catch {}
      }
    } catch { break; }
    mentorPage++;
  }

  console.log(`[Seed] Completed. Students: ${totalSeeded}, Mentors: ${totalMentorsSeeded}`);

  return NextResponse.json({
    success: true,
    totalSeeded,
    totalMentorsSeeded,
    message: `Successfully seeded ${totalSeeded} students and ${totalMentorsSeeded} mentors into Prisma.`,
  });
}

