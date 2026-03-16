import { groq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { rawText, field } = await req.json();

    const result = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      schema: z.object({
        academics: z.array(z.object({
          key: z.string(),
          value: z.string(),
          confidence: z.number(),
        })),
        clinical: z.array(z.object({
          key: z.string(),
          value: z.string(),
          confidence: z.number(),
        })),
        summary: z.string(),
        missingInfo: z.array(z.string()),
      }),
      system: `You are an expert ${field} admissions data extractor. 
Analyze the raw text from an academic transcript or CV and extract key metrics.
Categories: Academics (GPA, Exam scores), Clinical/Voluntary (Shadowing, Placement).
Provide a confidence score for each extraction.`,
      prompt: `Extract structured ${field} application data from the following text: \n\n ${rawText}`,
      temperature: 0.1,
    });

    return new Response(JSON.stringify(result.object), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Transcript Parse Error:", error);
    return new Response(JSON.stringify({ error: "Failed to parse transcript data." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
