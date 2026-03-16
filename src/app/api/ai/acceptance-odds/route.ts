import { groq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";

export const maxDuration = 45;

export async function POST(req: Request) {
  try {
    const { profile, field } = await req.json();

    const result = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      schema: z.object({
        overallOdds: z.number().min(0).max(100),
        breakdown: z.array(z.object({
          category: z.string(),
          status: z.enum(["High Impact", "Moderate", "Growth Area"]),
          analysis: z.string()
        })).length(3),
        recommendations: z.array(z.string()).length(3),
        summary: z.string(),
      }),
      system: `You are a senior healthcare admissions data scientist. 
The user is providing their academic and extracurricular profile for a ${field} application.
Calculate their "Acceptance Odds" based on typical competitive benchmarks (GPA, test scores, clinical hours, etc.).
Be realistic but encouraging. 
Provide a breakdown of their profile's impact and three clear recommendations to boost their candidacy.`,
      prompt: `Profile Data:\n${JSON.stringify(profile, null, 2)}\n\nField: ${field}`,
      temperature: 0.4,
    });

    return new Response(JSON.stringify(result.object), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Odds Calculator Error:", error);
    return new Response(JSON.stringify({ error: "Failed to calculate odds." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
