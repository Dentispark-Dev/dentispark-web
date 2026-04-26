import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { proxyRequest } from "@/src/app/api/backend/[...path]/route";

const prisma = new PrismaClient();

/**
 * DIRECT USER CREATION OVERRIDE
 * 
 * Allows admins to create users (Admin, Mentor, Student) directly in the local DB.
 */
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_USE_LOCAL_AUTH !== "true") {
    return proxyRequest(request, ["admin", "users", "create"]);
  }

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
        // Set as active immediately for admin-created users
        // activationStatus is a field in StudentRecord but not directly in User prisma model?
        // Let's check schema again. 
      }
    });

    // If it's a mentor, create mentor profile
    if (role === Role.MENTOR) {
        await prisma.mentorProfile.create({
            data: {
                userId: newUser.id,
                isVerified: true,
                specialties: platformMemberCategory ? [platformMemberCategory] : [],
                // Add other defaults
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
    }, { status: 500 });
  }
}
