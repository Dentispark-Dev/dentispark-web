import { groq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";

export const maxDuration = 45;

export async function POST(req: Request) {
  try {
    const { currentStage, targetUniversities, field, recentActivity } = await req.json();

    const result = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      schema: z.object({
          nextStep: z.string(),
          motivationPrompt: z.string(),
          priority: z.enum(["high", "medium", "low"]),
          reasoning: z.string(),
          suggestedTool: z.string(), // Name of a tool in AI Hub
      }),
      system: `You are the DentiSpark Success Co-pilot for ${field} students.
Analyze the user's current progress: "${currentStage}" and recent activity: "${recentActivity}".
User is targeting: ${targetUniversities.join(", ")}.
Determine the single most important next step they should take to maximize their chances.`,
      prompt: `Generate a proactive recommendation for a ${field} applicant.`,
      temperature: 0.7,
    });

    return new Response(JSON.stringify(result.object), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Recommendation Engine Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate recommendation." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
