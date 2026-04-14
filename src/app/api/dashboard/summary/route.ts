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
      totalSummary: {
        description: "Total platform wide active users",
        currentTotalCount: totalStudents + totalMentors,
        percentageChange: 12.5,
        days: 30
      },
      studentSummary: {
        description: "Total students registered",
        currentTotalCount: totalStudents,
        percentageChange: 8.2,
        days: 30
      },
      mentorSummary: {
        description: "Total academic mentors registered",
        currentTotalCount: totalMentors,
        percentageChange: 5.4,
        days: 30
      },
      revenueSummary: {
        description: "Platform revenue metrics",
        currentTotalCount: 0,
        percentageChange: 0,
        days: 30
      }
    };

    return NextResponse.json({
      responseCode: "00",
      responseMessage: "Dashboard summary retrieved successfully",
      responseData,
      success: true
    });
  } catch (error: any) {
    console.error("[Dashboard Summary API Error]", error);
    return NextResponse.json({
      responseCode: "ERROR",
      responseMessage: "Failed to retrieve dashboard summary locally",
      errors: [error.message || "Unknown error"],
      stack: error.stack,
      dbUrl: process.env.DATABASE_URL ? "SET (ends with " + process.env.DATABASE_URL.slice(-10) + ")" : "MISSING",
      success: false
    }, { status: 500 });
  }
}
