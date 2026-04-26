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
    const identifier = decodeURIComponent(email).trim();
    const lowerIdentifier = identifier.toLowerCase();
    
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
        console.log(`[Admin Delete Fallback] User not found in Prisma: ${identifier}. Proxying to Java...`);
        
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.dentispark.com";
        const backendUrl = `${API_URL}/admin/admins/${encodeURIComponent(identifier)}`;
        
        const accessToken = request.cookies.get("accessToken")?.value;
        const channelId = process.env.NEXT_PUBLIC_CHANNEL_ID;
        const channelSecret = process.env.NEXT_PUBLIC_CHANNEL_SECRET;
        
        const requestId = Math.random().toString(36).substring(7);
        const headers: Record<string, string> = {
            "Accept": "application/json",
            "User-Agent": request.headers.get("user-agent") || "DentiSpark-Proxy/1.0",
            "X-Request-ID": requestId,
        };

        const origin = request.headers.get("origin");
        if (origin) headers["Origin"] = origin;
        
        const referer = request.headers.get("referer");
        if (referer) headers["Referer"] = referer;

        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }

        if (channelId) headers["Channel-ID"] = channelId;
        if (channelSecret) headers["Channel-Secret"] = channelSecret;

        const response = await fetch(backendUrl, {
            method: "DELETE",
            headers,
            cache: "no-store",
        });

        const responseText = await response.text();
        let data: any;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            data = { message: responseText };
        }
        
        if (!response.ok) {
            return NextResponse.json({
                responseCode: "99",
                responseMessage: data.responseMessage || data.message || `Java Backend Error (Status ${response.status})`,
                message: data.message || data.responseMessage || `Java Backend Error (Status ${response.status})`,
                errors: data.errors || [],
                rawResponse: responseText.substring(0, 1000)
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

    // Handle related records that don't have Cascade Delete
    // Delete all bookings where this user is the student
    await prisma.booking.deleteMany({
        where: { studentId: user.id }
    });

    // Check if this admin also has a mentor profile
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
      responseMessage: "Administrator deleted successfully",
      responseData: identifier
    }, { 
      status: 200,
      headers: { "X-Handled-Locally": "true" }
    });

  } catch (error: any) {
    console.error("[Local Admin Delete Admin Error]", error);
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
