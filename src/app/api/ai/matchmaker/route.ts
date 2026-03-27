import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { z } from "zod";
import { UK_DENTAL_SCHOOLS } from "@/src/features/(dashboard)/university-hub/constants/universities";

export const maxDuration = 45;

export async function POST(req: Request) {
  try {
    const { profile, field } = await req.json();

    const result = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system: `You are the DentiSpark "Admission Alpha" Matchmaker. 
Your goal is to provide precise acceptance probabilities and gap analysis for specific UK ${field} schools.

Available Schools:
${JSON.stringify(UK_DENTAL_SCHOOLS.map(u => ({ id: u.id, name: u.name })), null, 2)}

Logic:
1. Evaluate the student profile against typical UK admission criteria (GPA, test scores, clinical experience).
2. For each school, provide a probability score and identified Gaps.
3. Suggest 2-3 school-specific Success Steps.

Return ONLY a valid raw JSON object matching this exact structure (no markdown blocks, no extra text):
{
  "universityPredictions": [
    {
      "universityId": "string",
      "universityName": "string",
      "probability": number, // integer 0-100
      "riskLevel": "Low" | "Moderate" | "High" | "Critical",
      "gapAnalysis": [ "string" ], // 1 to 4 items
      "successSteps": [ "string" ] // 1 to 4 items
    }
  ],
  "overallStrategy": "string"
}`,
      prompt: `Student Profile:\n${JSON.stringify(profile, null, 2)}\n\nField: ${field}`,
      temperature: 0.2,
    });

    const cleanJson = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleanJson);

    return new Response(JSON.stringify(parsedData), {
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
