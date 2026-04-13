import { NextResponse } from "next/server";
import prisma from "@/src/lib/db";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("pageNumber") || "0");
    const size = parseInt(searchParams.get("pageSize") || "10");
    const searchKey = searchParams.get("searchKey");
    const category = searchParams.get("platformMemberCategory");
    const status = searchParams.get("platformMemberProfileStatus");

    // Build Prisma query
    const where: Prisma.UserWhereInput = {
      role: "STUDENT"
    };

    if (searchKey) {
      where.OR = [
        { firstName: { contains: searchKey, mode: 'insensitive' } },
        { lastName: { contains: searchKey, mode: 'insensitive' } },
        { email: { contains: searchKey, mode: 'insensitive' } },
        { sid: { contains: searchKey, mode: 'insensitive' } }
      ];
    }

    if (category) {
      where.memberCategory = category;
    }

    if (status) {
      where.activationStatus = status;
    }

    const [students, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: page * size,
        take: size,
        orderBy: { createdAt: "desc" }
      }),
      prisma.user.count({ where })
    ]);

    // Map to frontend expected shape (StudentRecord)
    const content = students.map(s => ({
      sid: s.sid || s.id,
      firstName: s.firstName || s.name?.split(' ')[0] || "Student",
      lastName: s.lastName || s.name?.split(' ').slice(1).join(' ') || "",
      emailAddress: s.email,
      dentalSchoolGateway: s.gateway || "BDS", // Default to BDS for now
      paymentStatus: (s as unknown as Record<string, string>).paymentStatus || "FREE",
      activationStatus: (s as unknown as Record<string, string>).activationStatus || "ACTIVE",
      dateStamped: s.createdAt.toISOString()
    }));

    return NextResponse.json({
      responseCode: "00",
      responseMessage: "Student records retrieved successfully",
      responseData: {
        content,
        totalElements: total,
        totalPages: Math.ceil(total / size),
        pageNumber: page,
        pageSize: size
      },
      success: true
    });
  } catch (error: unknown) {
    console.error("[Student Records API Error]", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to retrieve student records";
    return NextResponse.json({
      responseCode: "ERROR",
      responseMessage: "Failed to retrieve student records",
      errors: [errorMessage],
      success: false
    }, { status: 500 });
  }
}
