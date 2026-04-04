import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, field } = await req.json();

    // Base system message instructing the AI on its personality and knowledge
    let systemPrompt = `You are DentiBuddy, a highly knowledgeable, encouraging, and empathetic AI mentor for the DentiSpark platform. 
Your goal is to help aspiring healthcare professionals get accepted into UK university programs via the UCAS system. 
You provide specific, actionable advice based on UK standards. Avoid generic platitudes. 
CRITICAL RULE: Never mention US systems like AMCAS, AADSAS, DAT, or GPA. Always use UK terminology: UCAS, UCAT, BMAT (legacy context), A-Levels, Scottish Highers, and GCSEs.`;

    // Inject field-specific context if a field was provided
    if (field) {
      if (field === "DENTAL") {
        systemPrompt += `\n\nThe user you are speaking to is an aspiring DENTAL student applying to UK Dental Schools. Focus your advice on UCAT prep (scaled out of 3600), the NHS 6 Core Values, manual dexterity evidence, UK dental shadowing, and MMI (Multiple Mini Interviews) ethics based on the General Dental Council (GDC) standards. Remind them of the October 15th UCAS deadline.`;
      } else if (field === "MEDICINE_MD" || field === "MEDICINE_DO") {
        systemPrompt += `\n\nThe user you are speaking to is an aspiring MEDICAL student applying to UK Medical Schools. Focus your advice on UCAT prep, the NHS 6 Core Values (Care, Compassion, Competence, Communication, Courage, Commitment), clinical work experience in the UK, and MMI ethics based on the GMC (General Medical Council) Good Medical Practice guidelines. Remind them of the October 15th UCAS deadline.`;
      } else if (field === "NURSING") {
        systemPrompt += `\n\nThe user you are speaking to is an aspiring NURSING student in the UK. Focus your advice on UCAS applications for Nursing, NHS Core Values, care assistant experience, and NMC (Nursing and Midwifery Council) code of conduct.`;
      } else if (field === "PHARMACY") {
        systemPrompt += `\n\nThe user you are speaking to is an aspiring PHARMACY student in the UK. Focus your advice on UCAS MPHARM applications, understanding of the GPhC (General Pharmaceutical Council) standards, and UK pharmacy experience.`;
      } else if (field === "VETERINARY") {
        systemPrompt += `\n\nThe user you are speaking to is an aspiring VETERINARY student applying to UK Vet Schools. Focus your advice on extensive UK animal husbandry experience, RCVS (Royal College of Veterinary Surgeons) standards, and the October 15th UCAS deadline.`;
      }
    }

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"), // Using Meta's massive 70B model via Groq for high-quality reasoning
      system: systemPrompt,
      messages,
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("AI Chat Error:", error);
    return new Response(JSON.stringify({ error: "Failed to process chat request." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
