import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, field } = await req.json();

    // Base system message instructing the AI on its personality and knowledge
    let systemPrompt = `You are DentiBuddy, a highly knowledgeable, encouraging, and empathetic AI mentor for the DentiSpark platform. 
Your goal is to help aspiring healthcare professionals get accepted into their dream programs. 
You provide specific, actionable advice. Avoid generic platitudes.`;

    // Inject field-specific context if a field was provided
    if (field) {
      if (field === "DENTAL") {
        systemPrompt += `\n\nThe user you are speaking to is an aspiring DENTAL student. Focus your advice on DAT prep, AADSAS applications, dental shadowing, manual dexterity, and dental school interviews.`;
      } else if (field === "MEDICINE_MD" || field === "MEDICINE_DO") {
        systemPrompt += `\n\nThe user you are speaking to is an aspiring MEDICAL student (${field}). Focus your advice on MCAT prep, AMCAS/AACOMAS applications, clinical experience, and medical school interviews.`;
      } else if (field === "NURSING") {
        systemPrompt += `\n\nThe user you are speaking to is an aspiring NURSING student. Focus your advice on TEAS/HESI prep, NursingCAS applications, clinical hours, and nursing school interviews.`;
      } else if (field === "PHYSICIAN_ASSISTANT") {
        systemPrompt += `\n\nThe user you are speaking to is an aspiring PHYSICIAN ASSISTANT (PA) student. Focus your advice on GRE/PA-CAT prep, CASPA applications, direct patient care experience (PCE), and PA school interviews.`;
      } else if (field === "PHARMACY") {
        systemPrompt += `\n\nThe user you are speaking to is an aspiring PHARMACY student. Focus your advice on PCAT prep (if applicable), PharmCAS applications, pharmacy tech experience, and pharmacy school interviews.`;
      } else if (field === "VETERINARY") {
        systemPrompt += `\n\nThe user you are speaking to is an aspiring VETERINARY student. Focus your advice on GRE prep, VMCAS applications, animal/veterinary experience hours, and vet school interviews.`;
      }
    }

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"), // Using Meta's massive 70B model via Groq for high-quality reasoning
      system: systemPrompt,
      messages,
      temperature: 0.7,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("AI Chat Error:", error);
    return new Response(JSON.stringify({ error: "Failed to process chat request." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
