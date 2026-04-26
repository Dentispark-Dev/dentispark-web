import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

import { proxyRequest } from "@/src/app/api/backend/[...path]/route";

/**
 * LOCAL ADMIN LOGIN OVERRIDE
 * 
 * This route intercepts requests to /api/backend/auth/login
 * and validates them against the local Prisma database.
 */
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_USE_LOCAL_AUTH !== "true") {
    return proxyRequest(request, ["auth", "login"]);
  }

  try {
    const { emailAddress, password } = await request.json();

    if (!emailAddress || !password) {
      return NextResponse.json({
        responseCode: "07",
        responseMessage: "Email and password are required",
        responseData: null
      }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { 
        email: emailAddress.toLowerCase().trim(),
        role: "ADMIN"
      }
    });

    if (!user) {
      return NextResponse.json({
        responseCode: "03",
        responseMessage: "Admin record not found",
        responseData: null
      }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || "");
    if (!isPasswordValid) {
      return NextResponse.json({
        responseCode: "11",
        responseMessage: "Incorrect password",
        responseData: null
      }, { status: 401 });
    }

    const responseData = {
      externalId: user.id,
      firstName: user.firstName || user.name?.split(" ")[0] || "Admin",
      lastName: user.lastName || user.name?.split(" ").slice(1).join(" ") || "",
      emailAddress: user.email,
      memberType: "PLATFORM_ADMIN",
      profileStatus: "COMPLETED",
      auth: {
        accessToken: `local_admin_token_${user.id}`,
        tokenExpiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    };

    return NextResponse.json({
      responseCode: "00",
      responseMessage: "Admin login successful",
      responseData
    });

  } catch (error: any) {
    return NextResponse.json({
      responseCode: "99",
      responseMessage: "Error",
      errors: [error.message]
    }, { status: 500 });
  }
}
