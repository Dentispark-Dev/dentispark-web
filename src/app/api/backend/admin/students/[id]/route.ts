import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    
    // Check if user exists
    const user = await prisma.user.findUnique({
        where: { id }
    });

    if (!user) {
        return NextResponse.json({
            responseCode: "03",
            responseMessage: "Student record not found",
            responseData: null
        }, { status: 404 });
    }

    // Delete associated records first (if any) or use cascade if defined in schema
    // Based on schema, we should delete mentorProfile, AIHistory, etc. if they exist
    
    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({
      responseCode: "00",
      responseMessage: "Student deleted successfully",
      responseData: "SUCCESS"
    });

  } catch (error: any) {
    console.error("[Local Admin Delete Student Error]", error);
    return NextResponse.json({
      responseCode: "99",
      responseMessage: "Failed to delete student",
      errors: [error.message]
    }, { status: 500 });
  }
}
