import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type RouteContext = { params: Promise<{ email: string }> };

export async function DELETE(request: NextRequest, { params }: RouteContext) {
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
      responseMessage: "Failed to delete administrator",
      errors: [error.message]
    }, { status: 500 });
  }
}
