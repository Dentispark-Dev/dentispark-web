import { groq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";

export const maxDuration = 45;

export async function POST(req: Request) {
  try {
    const { text, field } = await req.json();

    const result = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      schema: z.object({
        score: z.number().min(0).max(100),
        metrics: z.array(z.object({
          name: z.string(),
          score: z.number().min(0).max(10),
          feedback: z.string()
        })),
        suggestions: z.array(z.string()),
      }),
      system: `You are an expert admissions consultant for healthcare programs, specifically for ${field} school applications.
Analyze the essay and return a structured assessment focusing on Academic Tone, Structure, Impact, and Field-Specific Proficiency (e.g. manual dexterity for Dentistry).`,
      prompt: `Review this personal statement for a ${field} application:\n\n${text}`,
      temperature: 0.2,
    });

    return new Response(JSON.stringify(result.object), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Personal Statement Review Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to analyze personal statement.";
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: errorMessage 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
