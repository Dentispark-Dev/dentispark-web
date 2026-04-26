import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * LOCAL LOGIN OVERRIDE
 * 
 * This route intercepts requests to /api/backend/auth/platform-member/login
 * and validates them against the local Prisma database. This allows testing
 * the mentorship features locally without a Java backend.
 */
export async function POST(request: NextRequest) {
  try {
    const { emailAddress, password } = await request.json();

    if (!emailAddress || !password) {
      return NextResponse.json({
        responseCode: "07",
        responseMessage: "Email and password are required",
        responseData: null
      }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: emailAddress.toLowerCase().trim() },
      include: {
        mentorProfile: true
      }
    });

    if (!user) {
      return NextResponse.json({
        responseCode: "03",
        responseMessage: "Sorry, this record does not exist. Please sign up and try again.",
        responseData: null
      }, { status: 404 });
    }

    if (!user.password) {
        return NextResponse.json({
            responseCode: "11",
            responseMessage: "Login failed. No password set for this account.",
            responseData: null
          }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({
        responseCode: "11",
        responseMessage: "Incorrect password or PIN entered",
        responseData: null
      }, { status: 401 });
    }

    // Prepare response data matching LoginResponseData type
    const responseData = {
      externalId: user.id,
      firstName: user.firstName || user.name?.split(" ")[0] || "User",
      lastName: user.lastName || user.name?.split(" ").slice(1).join(" ") || "",
      emailAddress: user.email,
      memberType: user.role === "MENTOR" ? "PLATFORM_MENTOR" : "PLATFORM_MEMBER",
      profileStatus: user.mentorProfile ? "COMPLETED" : "PENDING",
      auth: {
        accessToken: `local_token_${user.id}`,
        tokenExpiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    };

    return NextResponse.json({
      responseCode: "00",
      responseMessage: "Login successful",
      responseData
    });

  } catch (error: any) {
    console.error("[Local Login Error]", error);
    return NextResponse.json({
      responseCode: "99",
      responseMessage: "Unexpected system error occurred",
      errors: [error.message]
    }, { status: 500 });
  }
}
