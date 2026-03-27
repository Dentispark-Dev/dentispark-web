import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { field } = await req.json();

    const result = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system: `You are a community manager for a ${field || 'dental'} admissions platform. 
Generate a trending, engaging discussion topic or question that would stimulate conversation among dental/medical applicants.
Return ONLY a JSON object with the following structure:
{
  "topic": "string",
  "suggestedQuestion": "string"
}`,
      prompt: `Generate an engaging community post starter for ${field || 'dental'} applicants.`,
      temperature: 0.8,
    });

    // Extract JSON from response
    const text = result.text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;
    const data = JSON.parse(jsonStr);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Community Starter Error:", error);
    return new Response(JSON.stringify({ 
        error: "Failed to generate community starter.",
        suggestedQuestion: "What are your top tips for the upcoming admissions cycle?" // Fallback
    }), {
      status: 200, // Return 200 with fallback to prevent client crash
      headers: { "Content-Type": "application/json" },
    });
  }
}
