import { groq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { examDate, weakAreas, targetScore, field } = await req.json();

    const result = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      schema: z.object({
        phases: z.array(z.object({
          name: z.string(),
          duration: z.string(),
          focus: z.string(),
          milestone: z.string()
        })).length(3),
        weeklySchedule: z.array(z.object({
          day: z.string(),
          activity: z.string(),
          duration: z.string()
        })).length(7),
        materials: z.array(z.string()).length(4),
        tips: z.array(z.string()).length(3),
      }),
      system: `You are an expert ${field} entrance exam strategist. 
The user needs a 90-day study plan for their upcoming exam on ${examDate}. 
Their weak areas include: ${weakAreas}. 
Their target score is ${targetScore}.

Create a structured study plan divided into 3 phases: 
1. Foundation (Days 1-30)
2. Intensity (Days 31-60)
3. Precision & Mocks (Days 61-90)

Provide a representative sample weekly schedule and recommended materials for ${field}.`,
      prompt: `Generate a 90-day stratigic study plan for ${field} exam.`,
      temperature: 0.6,
    });

    return new Response(JSON.stringify(result.object), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Study Planner Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate study plan." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
