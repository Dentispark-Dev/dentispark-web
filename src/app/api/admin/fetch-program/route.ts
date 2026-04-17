import { groq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";
import axios from "axios";

export const maxDuration = 45;

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: "URL is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 1. Fetch the raw HTML content
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });

    const html = response.data;
    // Strip script and style tags to reduce token count
    const cleanContent = html
      .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
      .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, "")
      .replace(/<[^>]*>?/gm, " ") // Very aggressive stripping for LLM context
      .substring(0, 15000); // Take first 15k chars

    // 2. Use AI to extract structured data
    const { object } = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      schema: z.object({
        courseName: z.string().describe("The official name of the degree program"),
        degreeType: z.enum(["UNDERGRADUATE", "POSTGRADUATE", "GRADUATE_ENTRY", "OTHER"]).describe("The level of study"),
        durationYears: z.number().optional().describe("Number of years for completion"),
        entryRequirements: z.string().describe("Summary of academic requirements (e.g. AAA, 128 UCAS points)"),
        overview: z.string().describe("2-3 sentence description of the course"),
        fees: z.string().optional().describe("Tuition fees for Home or International students if found"),
        intakeMonth: z.string().optional().describe("Primary intake month, usually September"),
      }),
      prompt: `You are a data extraction bot. Extract university course details from the following web content:
      
      URL: ${url}
      
      CONTENT:
      ${cleanContent}
      `,
    });

    return new Response(JSON.stringify(object), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Fetch Program API Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch or parse program details. The site might be blocking our scraper." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
