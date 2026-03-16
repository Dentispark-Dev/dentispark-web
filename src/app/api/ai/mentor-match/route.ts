import { groq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";

export const maxDuration = 45;

export async function POST(req: Request) {
  try {
    const { targetUniversities, focusAreas, field } = await req.json();

    const result = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      schema: z.object({
        matchingLogic: z.string(),
        idealMentorDNA: z.array(z.string()).length(3),
        strategicTips: z.array(z.string()).length(3),
        consultationFocus: z.string(),
      }),
      system: `You are a student-mentor matching specialist for ${field} applications. 
The student is targeting: ${targetUniversities.join(", ")} and needs help with: ${focusAreas.join(", ")}.
Explain the logic behind find the best mentor for them and provide strategic advice for their consultation.`,
      prompt: `Analyze the student's requirements and provide optimal mentor matching DNA and strategy for ${field}.`,
      temperature: 0.6,
    });

    return new Response(JSON.stringify(result.object), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Mentor Match Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate mentor matching insights." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
