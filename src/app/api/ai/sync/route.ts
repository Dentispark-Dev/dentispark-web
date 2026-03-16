import { NextResponse } from "next/server";

// Mock database for intelligence persistence (Simulated)
// In production, this would be a PostgreSQL/Prisma call
let intelligenceStore: Record<string, any[]> = {};

export async function POST(req: Request) {
  try {
    const { userId, toolId, accomplishment, metadata } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Persist the accomplishment
    if (!intelligenceStore[userId]) {
      intelligenceStore[userId] = [];
    }

    intelligenceStore[userId].push({
      toolId,
      accomplishment,
      metadata,
      timestamp: new Date().toISOString(),
    });

    console.log(`[AI Sync] Persisted accomplishment for ${userId}: ${accomplishment}`);

    return NextResponse.json({ 
      success: true, 
      syncStatus: "synced",
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to sync intelligence data." }, { status: 500 });
  }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    
    return NextResponse.json({ 
        history: intelligenceStore[userId] || [] 
    });
}
