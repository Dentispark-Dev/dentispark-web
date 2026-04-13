import { NextResponse } from "next/server";
import prisma from "@/src/lib/db";
import { Role } from "@prisma/client";

export async function GET() {
  try {
    // Current counts
    const totalStudents = await prisma.user.count({ where: { role: "STUDENT" as Role } });
    const totalMentors = await prisma.user.count({ where: { role: "MENTOR" as Role } });
    // Assuming 'active' means logged in or updated in last 7 days for now
    const activeUsers = await prisma.user.count({ 
      where: { 
        updatedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 
      } 
    });

    // Mock trends for now since we don't have historical snapshots yet,
    // but structure it as per PDF Section 9.1
    const responseData = {
      totalStudents,
      totalMentors,
      totalPosts: 0, // Placeholder until Content module is finished
      activeUsers,
      trends: {
        students: { value: totalStudents, percentageChange: 12.5 },
        mentors: { value: totalMentors, percentageChange: 8.2 },
        posts: { value: 0, percentageChange: 0.0 }
      }
    };

    return NextResponse.json({
      responseCode: "00",
      responseMessage: "Dashboard summary retrieved successfully",
      responseData,
      success: true
    });
  } catch (error: unknown) {
    console.error("[Dashboard Summary API Error]", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to retrieve dashboard summary";
    return NextResponse.json({
      responseCode: "ERROR",
      responseMessage: "Failed to retrieve dashboard summary",
      errors: [errorMessage],
      success: false
    }, { status: 500 });
  }
}
