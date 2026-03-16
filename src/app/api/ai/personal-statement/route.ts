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
          score: z.number().min(0).max(100),
          feedback: z.string()
        })).length(4),
        suggestions: z.array(z.string()).min(3).max(5),
      }),
      system: `You are an expert admissions consultant for healthcare programs, specifically for ${field} school applications.
Your task is to review the provided Personal Statement/Essay and provide a detailed, objective score and qualitative feedback.
Evaluate the following 4 metrics:
1. Academic Tone: Professionalism and use of field-appropriate language.
2. Structure & Flow: Logical progression and transitions.
3. Impact: Strength of motivation and personal reflection.
4. Field-Specific Proficiency: For DENTAL, look for manual dexterity and patient interaction. For MEDICINE, look for clinical shadowing and empathy. For others, focus on relevant clinical exposure.

Provide extremely constructive, specific suggestions for improvement.`,
      prompt: `Review this personal statement for a ${field} application:\n\n${text}`,
      temperature: 0.5,
    });

    return new Response(JSON.stringify(result.object), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Personal Statement Review Error:", error);
    return new Response(JSON.stringify({ error: "Failed to analyze personal statement." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
