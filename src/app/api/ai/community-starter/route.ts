import { groq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { field } = await req.json();

    const result = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      schema: z.object({
        topic: z.string(),
        suggestedQuestion: z.string(),
      }),
      system: `You are a community manager for a ${field} admissions platform. 
Generate a trending, engaging discussion topic or question that would stimulate conversation among dental/medical applicants.
Make it relatable, slightly controversial (in an academic sense), or focused on current events in the field.`,
      prompt: `Generate an engaging community post starter for ${field} applicants.`,
      temperature: 0.8,
    });

    return new Response(JSON.stringify(result.object), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Community Starter Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate community starter." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
