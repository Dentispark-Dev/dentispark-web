import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { procedures, reflection } = await req.json();

    const result = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system: `You are a UCAS personal statement writing coach specializing in dentistry applications. 
Generate a single polished paragraph (80-120 words) suitable for a dental school personal statement. 
The paragraph must integrate the student's clinical observations and personal reflection naturally. 
Focus on demonstrating: clinical awareness, empathy, manual dexterity appreciation, and NHS values alignment.
Write in first person. Do NOT use bullet points. Output ONLY the paragraph text with no extra commentary.`,
      prompt: `The student observed these procedures during their clinical placement: ${procedures.join(", ")}.
Their personal reflection: "${reflection}".
Generate one polished UCAS personal statement paragraph incorporating these experiences.`,
      temperature: 0.7,
    });

    return new Response(JSON.stringify({ draft: result.text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.warn("Shadowing Log AI Failed - Using Smart Heuristic:", error);

    const body = await req.clone().json().catch(() => ({}));
    const { procedures = [], reflection = "" } = body;

    const procedureText = procedures.length > 0 ? procedures.join(" and ") : "clinical procedures";
    const reflectionSnippet = reflection.length > 20 ? reflection.substring(0, 60) + "..." : "my clinical observations";

    const fallbackDraft = `During my week-long placement at a dental practice, I had the privilege of observing ${procedureText} first-hand. Watching the clinician navigate each case reinforced my understanding of the precision and empathy required in modern dentistry. Reflecting on ${reflectionSnippet}, I recognised how clinical excellence is inseparable from genuine patient communication. This experience strengthened my resolve to pursue dentistry, confirming that the discipline demands not only technical manual dexterity but also the interpersonal skills emphasised in the NHS Constitution's core values.`;

    return new Response(JSON.stringify({ draft: fallbackDraft, isFallback: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}
