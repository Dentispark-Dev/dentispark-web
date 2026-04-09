import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system: `You are Denti-Buddy, a premium AI admissions assistant for DentiSpark. 
Your goal is to help students get into dental school with expert, encouraging, and highly specific advice.
Focus on:
- UCAT/MMI strategies
- Personal statements for Dentistry
- UK Dental school requirements
- Clinical knowledge and ethical scenarios
Be professional, concise, and use a friendly "mentor" tone.
Avoid repeating the exact same phrases. Limit your responses to 1-2 short paragraphs maximum.`,
      messages: messages,
      temperature: 0.7,
    });

    return new Response(JSON.stringify({ content: result.text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate response." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
