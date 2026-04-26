import { NextRequest, NextResponse } from "next/server";
import { proxyRequest } from "@/src/app/api/backend/[...path]/route";
import prisma from "@/src/lib/db";

type RouteContext = { params: Promise<{ email: string }> };

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
    const { email } = await params;
    const emailAddress = decodeURIComponent(email);
    
    const user = await prisma.user.findUnique({
        where: { email: emailAddress }
    });

    if (!user) {
        return NextResponse.json({
            responseCode: "03",
            responseMessage: "Admin record not found",
            responseData: null
        }, { status: 404 });
    }

    await prisma.user.delete({
      where: { email: emailAddress }
    });

    return NextResponse.json({
      responseCode: "00",
      responseMessage: "Admin deleted successfully",
      responseData: "SUCCESS"
    });

  } catch (error: any) {
    console.error("[Local Admin Delete Admin Error]", error);
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
