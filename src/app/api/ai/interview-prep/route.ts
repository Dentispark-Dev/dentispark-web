import { groq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { question, transcript, field, difficulty } = await req.json();

    const result = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      schema: z.object({
        metrics: z.array(z.object({
          label: z.string(),
          score: z.number().min(0).max(100),
        })).length(4),
        strengths: z.array(z.string()).length(3),
        improvements: z.array(z.string()).length(3),
        critique: z.string(),
      }),
      system: `You are an elite ${field} school admissions interviewer conducting a high-pressure MMI simulation. 
The user has just answered an interview question using real-time voice-to-text transcription.
Your job is to provide a sharp, realistic, and highly constructive evaluation of their answer.
The difficulty level is ${difficulty}.

Evaluate based on:
1. Vocal Clarity & Confidence: Professionalism, clarity, pace, and simulated verbal delivery.
2. Structure: Effectiveness of the STAR technique or logical progression.
3. ${field === "DENTAL" ? "GDC Standards" : field === "MEDICINE_MD" ? "GMC Standards" : "Field Standards"}: Knowledge and ethical awareness.
4. Social Intelligence & NHS Values: Integration of empathy, commitment, healthcare insight, and "soft skill" awareness.

Provide a tailored critique and three specific strengths/improvements.`,
      prompt: `Original Question: ${question}\n\nCandidate's Response: ${transcript}`,
      temperature: 0.7,
    });

    return new Response(JSON.stringify(result.object), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Interview Feedback Error:", error);
    return new Response(JSON.stringify({ error: "Failed to analyze interview response." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
