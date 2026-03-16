import { groq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";

export const maxDuration = 45;

export async function POST(req: Request) {
  try {
    const { studentId, mentorId } = await req.json();

    // In a real app, we would fetch the synced history from the DB/Intelligence Store
    // For this prototype, we'll simulate the data that would be used to generate insights
    const mockHistory = [
      { toolId: "transcript-parser", accomplishment: "Extracted GPA 3.92", timestamp: "2024-03-15" },
      { toolId: "personal-statement", accomplishment: "Achieved 82% Review Score", timestamp: "2024-03-14" },
      { toolId: "interview-prep", accomplishment: "Completed Mock Session (78%)", timestamp: "2024-03-12" }
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
