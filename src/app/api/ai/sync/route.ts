import { NextResponse } from "next/server";
import prisma from "@/src/lib/db";

export async function POST(req: Request) {
  try {
    const { userId, toolId, accomplishment, metadata } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Persist real data to PostgreSQL via Prisma
    const record = await prisma.aIHistory.create({
      data: {
        userId,
        toolIdentifier: toolId,
        accomplishment,
        metadata: metadata || {},
      },
    });

    console.log(`[AI Sync] Persisted to Contabo DB for ${userId}: ${record.id}`);

    return NextResponse.json({ 
      success: true, 
      syncStatus: "synced",
      recordId: record.id,
      timestamp: record.timestamp
    });
  } catch (error: unknown) {
    console.error("AI Sync Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to sync intelligence data.";
    return NextResponse.json({ 
      error: "Failed to sync intelligence data.",
      details: errorMessage 
    }, { status: 500 });
  }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    
    const history = await prisma.aIHistory.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 50
    });
    
    return NextResponse.json({ history });
}
