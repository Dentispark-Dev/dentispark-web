import { NextResponse } from "next/server";
import prisma from "@/src/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId },
      select: { availability: true }
    });

    return NextResponse.json({ availability: mentorProfile?.availability || null });
  } catch (error: unknown) {
    console.error("Fetch Availability Error:", error);
    return NextResponse.json({ error: "Failed to fetch availability." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, availability } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Update or create mentor profile if it doesn't exist? 
    // Actually, we should probably assume the profile exists or use upsert.
    // For availability, we need the profile to exist.
    
    const mentorProfile = await prisma.mentorProfile.upsert({
      where: { userId },
      update: { availability },
      create: {
        userId,
        availability,
        // Provide reasonable defaults if creating fresh
        title: "Mentor",
        credentials: "Verified DentiSpark Mentor",
        bio: "Bio coming soon...",
        hourlyRate: 50.0,
        specialties: ["General Mentorship"]
      }
    });

    return NextResponse.json({ success: true, availability: mentorProfile.availability });
  } catch (error: unknown) {
    console.error("Save Availability Error:", error);
    return NextResponse.json({ error: "Failed to save availability." }, { status: 500 });
  }
}
