import { groq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";

export const maxDuration = 45;

export async function POST(req: Request) {
  try {
    const { personalStatementText, field } = await req.json();

    if (!personalStatementText || personalStatementText.length < 50) {
      return new Response(
        JSON.stringify({ error: "Personal statement is too short to review." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Determine target based on field
    let targetProfession = "Medical Provider";
    if (field === "DENTAL") targetProfession = "Dentist";
    if (field === "MEDICINE_MD" || field === "MEDICINE_DO") targetProfession = "Doctor";
    if (field === "VETERINARY") targetProfession = "Veterinarian";

    // Call the GROQ model using structured JSON output
    const { object } = await generateObject({
      model: groq("llama-3.3-70b-versatile"), // Super fast and capable model
      schema: z.object({
        overallScore: z.number().min(1).max(10),
        nhsCoreValuesScore: z.number().min(1).max(10).describe("Score assessing alignment with NHS 6 Core Values (Care, Compassion, etc.)."),
        manualDexterityScore: z.number().min(1).max(10).optional().describe("Score based on evidence of fine motor skills (Crucial for Dental/Surgical pathways)."),
        motivationScore: z.number().min(1).max(10).describe("Strength of the motivation to study this exact profession in the UK healthcare system."),
        strengths: z.array(z.string()).describe("List of 2-3 strongest points in the draft."),
        weaknesses: z.array(z.string()).describe("List of 2-3 weak points or red flags."),
        actionableFeedback: z.string().describe("A professional, encouraging 3-sentence paragraph on how to improve this for the UCAS application."),
      }),
      prompt: `You are an expert UK University Admissions Tutor for Healthcare degrees. 
Critique the following draft UCAS Personal Statement for a student applying to become a ${targetProfession} in the UK.
Evaluate based on strict UK UCAS standards, evidence of the NHS 6 Core values, work experience reflections (not just listing them), and academic rigor.

Personal Statement Draft:
"""
${personalStatementText}
"""
`,
    });

    return new Response(JSON.stringify(object), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Personal Statement API Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate AI analysis." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
