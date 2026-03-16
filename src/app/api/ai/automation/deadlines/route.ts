import { groq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";

export const maxDuration = 45;

export async function POST(req: Request) {
  try {
    const { targetUniversities, field } = await req.json();

    const result = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      schema: z.object({
        deadlines: z.array(z.object({
          id: z.string(),
          title: z.string(),
          date: z.string(),
          type: z.enum(["major", "minor"]),
          description: z.string(),
        })),
      }),
      system: `You are an expert in UK ${field} admissions deadlines for the 2026/27 cycle.
Provide specific, accurate deadlines for the following universities: ${targetUniversities.join(", ")}.
Include UCAS deadlines and supplementary form/test deadlines (UCAT/BMAT/etc).`,
      prompt: `List key deadlines for ${field} applicants targeting ${targetUniversities.join(", ")}.`,
      temperature: 0.2,
    });

    return new Response(JSON.stringify(result.object), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Deadline Discovery Error:", error);
    return new Response(JSON.stringify({ error: "Failed to discover deadlines." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
