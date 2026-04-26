import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { proxyRequest } from "@/src/app/api/backend/[...path]/route";

const prisma = new PrismaClient();

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const isVercel = process.env.VERCEL === "1";
  const forceLocal = process.env.NEXT_PUBLIC_USE_LOCAL_AUTH === "true";

  if ((process.env.NODE_ENV === "production" || isVercel) && !forceLocal) {
    const { id } = await params;
    return proxyRequest(request, ["admin", "mentors", id]);
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
      responseMessage: "Failed to delete mentor",
      errors: [error.message]
    }, { 
      status: 500,
      headers: { "X-Local-Override": "true" }
    });
  }
}
