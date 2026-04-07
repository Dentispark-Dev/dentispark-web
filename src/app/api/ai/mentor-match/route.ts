import { groq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";

export const maxDuration = 45;

export async function POST(req: Request) {
  try {
    const { targetUniversities, focusAreas, field } = await req.json();

    const result = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      schema: z.object({
        matchingLogic: z.string(),
        idealMentorDNA: z.array(z.string()).min(1),
        strategicTips: z.array(z.string()).min(1),
        consultationFocus: z.string(),
      }),
      system: `You are a student-mentor matching specialist for ${field || 'Healthcare'} applications. 
The student is targeting: ${(targetUniversities && targetUniversities.length > 0) ? targetUniversities.join(", ") : "Top Dental Schools"} and needs help with: ${(focusAreas && focusAreas.length > 0) ? focusAreas.join(", ") : "General Application Strategy"}.
Explain the logic behind finding the best mentor for them and provide strategic advice for their consultation.
AIM for exactly 3 items in 'idealMentorDNA' and 'strategicTips' if possible, but prioritize factual accuracy.`,
      prompt: `Analyze the student's requirements and provide optimal mentor matching DNA and strategy for ${field || 'Dental'}.`,
      temperature: 0.6,
    });

    return new Response(JSON.stringify(result.object), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.warn("AI Insight Generation Failed - Falling Back to Smart Heuristic:", error);
    
    // SMART HEURISTIC FALLBACK
    const body = await req.clone().json().catch(() => ({}));
    const { targetUniversities = [], focusAreas = [] } = body;
    
    const fallbackData = {
      matchingLogic: `We've prioritized mentors who have personal experience with ${targetUniversities.length > 0 ? targetUniversities[0] : "your target schools"} and specialize in ${focusAreas.length > 0 ? focusAreas[0] : "admissions strategy"}.`,
      idealMentorDNA: [
        "Clinically Active Specialist",
        "Higher Education Admissions Veteran",
        "Expert in " + (focusAreas[0] || "Dental Readiness")
      ],
      strategicTips: [
        "Focus on evidencing manual dexterity through reflective practice.",
        "Prepare standardized MMI ethical scenario roleplays.",
        "Link your work experience to core NHS values."
      ],
      consultationFocus: `Focus your initial session on ${focusAreas.length > 0 ? focusAreas[0] : "strategic planning"} and university-specific interview nuances.`,
      isFallback: true
    };

    return new Response(JSON.stringify(fallbackData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}
