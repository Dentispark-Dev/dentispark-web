import { groq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";

export const maxDuration = 45;

export async function POST(req: Request) {
  try {
    const { userId, field, history, profileStats } = await req.json();

    const result = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      schema: z.object({
        overallScore: z.number().min(0).max(100),
        rank: z.string(),
        breakdown: z.object({
          academics: z.number().min(0).max(100),
          clinical: z.number().min(0).max(100),
          interview: z.number().min(0).max(100),
        }),
        recentImprovement: z.number(),
        insights: z.array(z.string()),
      }),
      system: `You are the DentiSpark "Spark Index" Engine. 
Your goal is to calculate a student's UK ${field} admissions readiness score (0-100).
A high score requires strong academic stats AND active participation in preparation tools.

Student Data:
- Field: ${field}
- Profile Stats: ${JSON.stringify(profileStats)}
- AI Hub Activity History: ${JSON.stringify(history)}

Logic:
1. Academics: Weighted by GPA/UCAT in profile stats and successful transcript parsing.
2. Clinical: Weighted by hours logged and AI-analyzed clinical reflections.
3. Interview: Weighted by Mock Interview performance and AI Guidance sessions.

Respond with structured success probability and insights.`,
      prompt: `Analyze enrollment readiness for user ${userId}.`,
      temperature: 0.3,
    });

    return new Response(JSON.stringify(result.object), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Spark Index Error:", error);
    return new Response(JSON.stringify({ error: "Failed to calculate Spark Index." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
