import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import prisma from "@/src/lib/db";

/**
 * DIRECT USER CREATION OVERRIDE
 * 
 * Allows admins to create users (Admin, Mentor, Student) directly in the local DB.
 * In production/Vercel, this will still work if DATABASE_URL is configured.
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { emailAddress, firstName, lastName, password, memberType, platformMemberCategory } = payload;

    if (!emailAddress || !firstName || !memberType) {
        return NextResponse.json({
            responseCode: "07",
            responseMessage: "Missing required fields",
            responseData: null
        }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email: emailAddress.toLowerCase().trim() }
    });

    if (existingUser) {
        return NextResponse.json({
            responseCode: "02",
            responseMessage: "A user with this email already exists",
            responseData: null
        }, { status: 409 });
    }

    // Map memberType to Prisma Role
    let role: Role = Role.STUDENT;
    if (memberType === "ACADEMIC_MENTOR") role = Role.MENTOR;
    if (memberType === "PLATFORM_ADMIN" || memberType === "MODERATOR" || memberType === "PLATFORM_SYSTEM") role = Role.ADMIN;

    const hashedPassword = await bcrypt.hash(password || "password123", 10);

    const newUser = await prisma.user.create({
      data: {
        email: emailAddress.toLowerCase().trim(),
        firstName,
        lastName,
        name: `${firstName} ${lastName}`.trim(),
        password: hashedPassword,
        role,
        activationStatus: "ACTIVE",
        memberCategory: platformMemberCategory || "BDS",
        gateway: "DIRECT_ADMIN",
        paymentStatus: role === Role.STUDENT ? "FREE" : "PAID",
      }
    });

    // If it's a mentor, create mentor profile
    if (role === Role.MENTOR) {
        await prisma.mentorProfile.create({
            data: {
                userId: newUser.id,
                isVerified: true,
                title: "Academic Mentor",
                credentials: platformMemberCategory || "General Dentistry",
                bio: "Experienced academic mentor added by platform administration.",
                specialties: platformMemberCategory ? [platformMemberCategory] : ["General Dentistry"],
                hourlyRate: 50.0,
            }
        });
    }

    return NextResponse.json({
      responseCode: "00",
      responseMessage: "User created successfully",
      responseData: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role
      }
    });

  } catch (error: any) {
    console.error("[Local Admin Create User Error]", error);
    return NextResponse.json({
      responseCode: "99",
      responseMessage: "Failed to create user",
      errors: [error.message]
    }, { 
      status: 500,
      headers: { "X-Local-Override": "true" }
    });
  }
}
