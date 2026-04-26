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
    
    // In local DB, mentors are also Users. We try to find by ID first.
    const user = await prisma.user.findUnique({
        where: { id }
    });

    if (!user) {
        return NextResponse.json({
            responseCode: "03",
            responseMessage: "Mentor record not found",
            responseData: null
        }, { status: 404 });
    }

    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({
      responseCode: "00",
      responseMessage: "Mentor deleted successfully",
      responseData: "SUCCESS"
    });

  } catch (error: any) {
    console.error("[Local Admin Delete Mentor Error]", error);
    return NextResponse.json({
      responseCode: "99",
      responseMessage: `Database Error: ${error.message}`,
      errors: [error.code, JSON.stringify(error.meta)]
    }, { 
      status: 500,
      headers: { "X-Local-Override": "true" }
    });
  }
}
