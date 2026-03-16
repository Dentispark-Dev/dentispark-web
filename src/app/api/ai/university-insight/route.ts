import { groq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";

export const maxDuration = 45;

export async function POST(req: Request) {
  try {
    const { universityName, field } = await req.json();

    const result = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      schema: z.object({
        missionAlignment: z.string(),
        interviewStrategy: z.string(),
        cultureFit: z.string(),
        pros: z.array(z.string()).length(3),
        cons: z.array(z.string()).length(2),
        successTip: z.string(),
      }),
      system: `You are an expert ${field} admissions consultant with deep knowledge of UK universities. 
The user is interested in ${universityName} for ${field}.
Provide targeted, data-driven insights on how to succeed in their application to this specific school.
Focus on mission alignment, specific interview formats (MMI/Panel), and culture.`,
      prompt: `Generate a campus strategy for ${universityName} in the field of ${field}.`,
      temperature: 0.5,
    });

    return new Response(JSON.stringify(result.object), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("University Insight Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate university insights." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
