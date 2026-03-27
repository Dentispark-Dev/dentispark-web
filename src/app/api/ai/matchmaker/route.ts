import { groq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";
import { UK_DENTAL_SCHOOLS } from "@/src/features/(dashboard)/university-hub/constants/universities";

export const maxDuration = 45;

export async function POST(req: Request) {
  try {
    const { profile, field } = await req.json();

    const result = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      schema: z.object({
        universityPredictions: z.array(z.object({
          universityId: z.string(),
          universityName: z.string(),
          probability: z.number().min(0).max(100).describe("Integer value between 0 and 100, do not include % symbol"),
          riskLevel: z.string().describe("Must exactly be one of: 'Low', 'Moderate', 'High', 'Critical'"),
          gapAnalysis: z.array(z.string()).min(1).max(4),
          successSteps: z.array(z.string()).min(1).max(4),
        })).min(1).max(6),
        overallStrategy: z.string(),
      }),
      system: `You are the DentiSpark "Admission Alpha" Matchmaker. 
Your goal is to provide precise acceptance probabilities and gap analysis for specific UK ${field} schools.

Available Schools:
${JSON.stringify(UK_DENTAL_SCHOOLS.map(u => ({ id: u.id, name: u.name })), null, 2)}

Logic:
1. Evaluate the student profile against typical UK admission criteria (GPA, test scores, clinical experience).
2. For each school, provide a probability score and identified "Gaps" (e.g., "UCAT score is below average for King's").
3. Suggest 2-3 school-specific "Success Steps" (e.g., "Focus on a clinical reflection for your Personal Statement to target Manchester's holistic review").
4. Be realistic and data-driven.`,
      prompt: `Student Profile:\n${JSON.stringify(profile, null, 2)}\n\nField: ${field}`,
      temperature: 0.3,
    });

    return new Response(JSON.stringify(result.object), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Matchmaker API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate university matching data." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
