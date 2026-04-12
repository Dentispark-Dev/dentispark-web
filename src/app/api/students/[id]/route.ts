import { NextResponse } from "next/server";
import prisma from "@/src/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const student = await prisma.user.findUnique({
      where: { id },
      include: {
        aiHistory: {
          orderBy: { timestamp: "desc" },
          take: 5
        }
      }
    });

    if (!student || student.role !== "STUDENT") {
      return NextResponse.json({
        responseCode: "NOT_FOUND",
        responseMessage: "Student not found",
        errors: ["No student exists with the provided identity"],
        success: false
      }, { status: 404 });
    }

    // Map to StudentDetail
    const responseData = {
      sid: student.sid || student.id,
      firstName: student.firstName || student.name?.split(' ')[0] || "Student",
      lastName: student.lastName || student.name?.split(' ').slice(1).join(' ') || "",
      emailAddress: student.email,
      phoneNumber: (student as any).phoneNumber || "N/A",
      activationStatus: (student as any).activationStatus || "ACTIVE",
      paymentStatus: (student as any).paymentStatus || "FREE",
      dentalSchoolGateway: student.gateway || "BDS",
      dateStamped: student.createdAt.toISOString(),
      academicHistory: student.aiHistory.map(h => ({
        tool: h.toolIdentifier,
        accomplishment: h.accomplishment,
        date: h.timestamp.toISOString()
      })),
      goals: "Secure Clinical Placement" // Placeholder
    };

    return NextResponse.json({
      responseCode: "00",
      responseMessage: "Student detail retrieved successfully",
      responseData,
      success: true
    });
  } catch (error: any) {
    console.error("[Student Detail API Error]", error);
    return NextResponse.json({
      responseCode: "ERROR",
      responseMessage: "Failed to retrieve student profile",
      errors: [error.message],
      success: false
    }, { status: 500 });
  }
}
