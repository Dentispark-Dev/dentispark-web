import { groq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";
import prisma from "@/src/lib/db";

export const maxDuration = 45;

export async function POST(req: Request) {
  try {
    const { studentId, mentorId } = await req.json();

    // Fetch real AI history from the database for the student
    const historyData = await prisma.aIHistory.findMany({
      where: { userId: studentId },
      orderBy: { timestamp: "desc" },
      take: 10,
    });

    const mockHistory = historyData.length > 0 
      ? historyData.map((h) => ({
          toolId: h.toolIdentifier,
          accomplishment: h.accomplishment,
          timestamp: h.timestamp.toISOString(),
        }))
      : [
          { toolId: "system", accomplishment: "Student has registered but no interaction history exists yet.", timestamp: new Date().toISOString() }
        ];

    const result = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      schema: z.object({
        summary: z.string(),
        strengths: z.array(z.string()),
        weaknesses: z.array(z.string()),
        mentorActionPoints: z.array(z.string()),
        predictedAcceptanceOdds: z.number().min(0).max(100),
      }),
      system: `You are the DentiSpark Mentor Intelligence AI.
Analyze a student's preparation history and provide deep insights for their mentor.
Focus on being professional, helpful, and identifying specific areas where the mentor can intervene.`,
      prompt: `Analyze preparation data for student ${studentId}: ${JSON.stringify(mockHistory)}`,
      temperature: 0.2,
    });

    return new Response(JSON.stringify(result.object), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Mentor Insights Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate student insights." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
