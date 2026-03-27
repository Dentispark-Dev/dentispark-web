import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { z } from "zod";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { examDate, weakAreas, targetScore, field } = await req.json();

    const result = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system: `You are an expert ${field} entrance exam strategist. 
The user needs a 90-day study plan for their upcoming exam on ${examDate}. 
Their weak areas include: ${weakAreas}. 
Their target score is ${targetScore}.

Create a structured study plan divided into exactly 3 phases: 
1. Foundation (Days 1-30)
2. Intensity (Days 31-60)
3. Precision & Mocks (Days 61-90)

Provide a representative 7-day sample weekly schedule and recommended materials specifically for ${field}. Limit to 3-5 tips and 3-5 materials.

Return ONLY a valid raw JSON object matching this exact structure (no markdown blocks, no text before or after):
{
  "phases": [ { "name": "string", "duration": "string", "focus": "string", "milestone": "string" } ],
  "weeklySchedule": [ { "day": "string", "activity": "string", "duration": "string" } ],
  "materials": [ "string" ],
  "tips": [ "string" ]
}`,
      prompt: `Generate a 90-day strategic study plan for the ${field} exam.`,
      temperature: 0.2,
    });

    const cleanJson = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleanJson);

    return new Response(JSON.stringify(parsedData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Study Planner Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate study plan. Reason: " + (error.message || String(error)) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
