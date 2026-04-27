import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/lib/db";

/**
 * API to manage the "Used ID" (sid) for a user.
 * 
 * GET /api/admin/users/sid?sid=Dr-Julius-Babayemi -> Checks if SID is available
 * PATCH /api/admin/users/[id]/sid -> Updates the SID for a specific user
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sid = searchParams.get("sid");

    if (!sid) {
      return NextResponse.json({ error: "SID is required" }, { status: 400 });
    }

    // Basic validation: only alphanumeric and dashes
    if (!/^[a-zA-Z0-9-]+$/.test(sid)) {
        return NextResponse.json({ 
            available: false, 
            error: "Invalid format. Only letters, numbers, and dashes are allowed." 
        });
    }

    const existing = await prisma.user.findFirst({
      where: { sid: { equals: sid, mode: "insensitive" } },
    });

    return NextResponse.json({ available: !existing });
  } catch (error) {
    return NextResponse.json({ error: "Failed to check availability" }, { status: 500 });
  }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { sid } = await request.json();

    if (!sid) {
      return NextResponse.json({ error: "SID is required" }, { status: 400 });
    }

    // Check availability (excluding current user)
    const existing = await prisma.user.findFirst({
      where: { 
          sid: { equals: sid, mode: "insensitive" },
          NOT: { id: id }
      },
    });

    if (existing) {
      return NextResponse.json({ error: "This ID is already taken" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { sid },
    });

    return NextResponse.json({ 
        success: true, 
        message: `System ID updated to ${sid}`,
        user: { id: user.id, sid: user.sid }
    });
  } catch (error) {
    console.error("[SID Update Error]", error);
    return NextResponse.json({ error: "Failed to update System ID" }, { status: 500 });
  }
}
