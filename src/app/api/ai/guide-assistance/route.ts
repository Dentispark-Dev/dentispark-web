import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, field } = await req.json();

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: `You are the DentiSpark Guidance Assistant. You are an expert in UK ${field} admissions (UCAS, entrance exams like UCAT/DAT, prerequisites, and clinical requirements).
You have a friendly, professional, and encouraging tone.
Always provide factual, up-to-date guidance. If you aren't sure about a specific deadline for the current year, advise the user to double-check the official UCAS or University website.
Keep responses concise but highly valuable.`,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Guidance Assistant Error:", error);
    return new Response(JSON.stringify({ error: "Failed to process guidance request." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
