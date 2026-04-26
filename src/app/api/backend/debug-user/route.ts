import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/lib/db";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const identifier = searchParams.get("id");

    if (!identifier) {
        return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { id: identifier },
                    { sid: identifier },
                    { email: identifier }
                ]
            },
            include: {
                mentorProfile: true,
                bookings: true,
                _count: {
                    select: {
                        bookings: true,
                        activities: true,
                        aiHistory: true,
                        reviews: true
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ found: false, message: "User not found in Prisma" });
        }

        return NextResponse.json({
            found: true,
            user: {
                id: user.id,
                sid: user.sid,
                email: user.email,
                role: user.role,
                hasMentorProfile: !!user.mentorProfile,
                mentorProfileId: user.mentorProfile?.id,
                bookingCount: user._count.bookings,
                activityCount: user._count.activities,
                aiHistoryCount: user._count.aiHistory,
                reviewCount: user._count.reviews
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
