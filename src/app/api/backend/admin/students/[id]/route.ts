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
    
    const identifier = decodeURIComponent(id).trim();
    const lowerIdentifier = identifier.toLowerCase();

    // Search by either cuid or sid
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { id: identifier },
                { sid: identifier },
                { sid: lowerIdentifier },
                { email: { equals: lowerIdentifier, mode: 'insensitive' } }
            ]
        }
    });

    if (!user) {
        // FALLBACK: If not in Prisma, try proxying to the Java backend
        console.log(`[Student Delete Fallback] User not found in Prisma: ${identifier}. Proxying to Java...`);
        
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.dentispark.com";
        const backendUrl = `${API_URL}/admin/students/${encodeURIComponent(identifier)}`;
        
        const accessToken = request.cookies.get("accessToken")?.value;
        const channelId = process.env.NEXT_PUBLIC_CHANNEL_ID;
        const channelSecret = process.env.NEXT_PUBLIC_CHANNEL_SECRET;
        
        const headers: Record<string, string> = {
            "Accept": "application/json",
            "Authorization": accessToken ? `Bearer ${accessToken}` : "",
            "Channel-ID": channelId || "",
            "Channel-Secret": channelSecret || "",
            "User-Agent": request.headers.get("user-agent") || "DentiSpark-Proxy/1.0",
            "Origin": request.headers.get("origin") || "https://www.dentispark.com",
            "Referer": request.headers.get("referer") || "https://www.dentispark.com/admin",
            "X-Proxy-Fallback": "true"
        };

        const response = await fetch(backendUrl, {
            method: "DELETE",
            headers,
            cache: "no-store",
        });

        const data = await response.json().catch(() => ({}));
        
        if (!response.ok) {
            return NextResponse.json({
                responseCode: "99",
                responseMessage: data.responseMessage || `Java Backend Error (Status ${response.status})`,
                message: data.message || data.responseMessage || `Java Backend Error (Status ${response.status})`,
                errors: data.errors || []
            }, { 
                status: response.status,
                headers: { "X-Proxied-To-Java-Fallback": "true" }
            });
        }
        
        return NextResponse.json(data, { 
            status: response.status,
            headers: { "X-Proxied-To-Java-Fallback": "true" }
        });
    }

    // Delete associated records first (if any) or use cascade if defined in schema
    // Based on schema, we should delete mentorProfile, AIHistory, etc. if they exist
    
    // Handle related records that don't have Cascade Delete
    // Delete all bookings where this user is the student
    await prisma.booking.deleteMany({
        where: { studentId: user.id }
    });

    // Check if this student also has a mentor profile
    const mentorProfile = await prisma.mentorProfile.findUnique({
        where: { userId: user.id }
    });

    if (mentorProfile) {
        // Delete all bookings for this mentor profile
        await prisma.booking.deleteMany({
            where: { mentorId: mentorProfile.id }
        });
    }

    await prisma.user.delete({
      where: { id: user.id }
    });

    return NextResponse.json({
      responseCode: "00",
      responseMessage: "Student deleted successfully",
      responseData: id
    }, { 
      status: 200,
      headers: { "X-Handled-Locally": "true" }
    });

  } catch (error: any) {
    console.error("[Local Admin Delete Student Error]", error);
    return NextResponse.json({
      responseCode: "99",
      responseMessage: `Database Error: ${error.message}`,
      message: `Database Error: ${error.message}`,
      errors: [error.code, JSON.stringify(error.meta)]
    }, { 
      status: 500,
      headers: { "X-Handled-Locally": "true" }
    });
  }
}
