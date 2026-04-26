import { NextRequest, NextResponse } from "next/server";
import { proxyRequest } from "@/src/app/api/backend/[...path]/route";
import prisma from "@/src/lib/db";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  // Check if database is configured
  if (!process.env.DATABASE_URL) {
      return NextResponse.json({
          responseCode: "99",
          responseMessage: "DATABASE_URL is not configured",
          responseData: null
      }, { status: 500 });
  }

  try {
    const { id } = await params;
    
    // Search by either cuid or sid (hid)
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { id },
                { sid: id }
            ]
        }
    });

    if (!user) {
        return NextResponse.json({
            responseCode: "03",
            responseMessage: "Mentor record not found",
            responseData: null
        }, { status: 404 });
    }

    // Handle related records that don't have Cascade Delete
    const mentorProfile = await prisma.mentorProfile.findUnique({
        where: { userId: user.id }
    });

    if (mentorProfile) {
        // Delete all bookings for this mentor
        await prisma.booking.deleteMany({
            where: { mentorId: mentorProfile.id }
        });
        
        // Reviews already have Cascade on mentorId in schema
    }

    // Delete the student bookings if this user was ever a student
    await prisma.booking.deleteMany({
        where: { studentId: user.id }
    });

    await prisma.user.delete({
      where: { id: user.id }
    });

    return NextResponse.json({
      responseCode: "00",
      responseMessage: "Mentor deleted successfully",
      responseData: id
    }, { 
      status: 200,
      headers: { "X-Handled-Locally": "true" }
    });

  } catch (error: any) {
    console.error("[Local Admin Delete Mentor Error]", error);
    return NextResponse.json({
      responseCode: "99",
      responseMessage: `Database Error: ${error.message}`,
      message: `Database Error: ${error.message}`,
      errors: [error.code, JSON.stringify(error.meta)]
    }, { 
      status: 500,
      headers: { "X-Local-Override": "true" }
    });
  }
}
