import { NextResponse } from "next/server";
import prisma from "@/src/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("pageNumber") || "0");
    const size = parseInt(searchParams.get("pageSize") || "10");

    const [activities, total] = await Promise.all([
      prisma.platformActivity.findMany({
        skip: page * size,
        take: size,
        orderBy: { timestamp: "desc" },
        include: {
          user: {
            select: {
              name: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true
            }
          }
        }
      }),
      prisma.platformActivity.count()
    ]);

    // Map to frontend expected format
    const content = activities.map(a => ({
      userId: a.userId,
      fullName: a.user.firstName ? `${a.user.firstName} ${a.user.lastName}` : (a.user.name || "Unknown User"),
      action: a.action,
      timeAndDate: a.timestamp.toISOString(),
      memberType: a.user.role,
      category: a.category || "GENERAL"
    }));

    return NextResponse.json({
      responseCode: "00",
      responseMessage: "Global activity retrieved successfully",
      responseData: {
        content,
        totalElements: total,
        totalPages: Math.ceil(total / size),
        pageNumber: page,
        pageSize: size
      },
      success: true
    });
  } catch (error: any) {
    console.error("[Global Activity API Error]", error);
    return NextResponse.json({
      responseCode: "ERROR",
      responseMessage: "Failed to retrieve global activity",
      errors: [error.message],
      success: false
    }, { status: 500 });
  }
}
