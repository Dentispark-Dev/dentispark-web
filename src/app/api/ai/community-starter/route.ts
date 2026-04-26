import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { field } = await req.json();

    const result = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system: `You are a helpful student community leader for DentiSpark, an elite platform for dental and medical school applicants. 
Your goal is to suggest a thought-provoking, high-engagement question or topic that a student could post in the community hub.
The field is ${field}.

Keep the suggestion:
1. Academic or Career-focused (e.g., UCAT, personal statement, clinical ethics, work experience).
2. Short and conversational (1-2 sentences max).
3. Open-ended to encourage peer discussion.
4. Professional yet approachable.`,
      prompt: `Suggest a high-engagement community post for a ${field === "DENTAL" ? "dental" : "medical"} applicant.`,
      temperature: 0.8,
    });

    return new Response(JSON.stringify({ suggestedQuestion: result.text.trim() }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Community Starter Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate suggestion." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
