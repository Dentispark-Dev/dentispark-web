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

    let cleanContent = "";
    let methodUsed = "Jina Reader";

    // 1. Try Jina Reader as primary scraper (best for Cloudflare/Markdown)
    try {
      const jinaUrl = `https://r.jina.ai/${url}`;
      const jinaResponse = await axios.get(jinaUrl, {
        timeout: 15000,
        headers: {
          'Accept': 'text/plain', // Jina returns text/markdown
        }
      });
      
      cleanContent = jinaResponse.data.substring(0, 20000); // Jina content is usually very clean
    } catch (jinaError: any) {
      console.warn("Jina Reader failed, falling back to basic axios scraper:", jinaError.message);
      
      // 2. Fallback to basic axios scraper (original logic)
      methodUsed = "Legacy Scraper";
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
          'Accept': 'text/html'
        },
        timeout: 10000
      });

      const html = response.data;
      cleanContent = html
        .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
        .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, "")
        .replace(/<[^>]*>?/gm, " ")
        .substring(0, 15000);
    }

    if (!cleanContent || cleanContent.trim().length < 100) {
      throw new Error("Extracted content is too short or empty. The site might be blocking all access methods.");
    }

    // 2. Use AI to extract structured data from Markdown/Text
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
      prompt: `You are a high-precision data extraction bot specialized in UK/International University course pages.
      Extract university course details from the following content (Scraping Method: ${methodUsed}).
      
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
      JSON.stringify({ 
        error: "Failed to fetch or parse program details. The site might be blocking our scraper or is using heavy bot protection.",
        details: error.message
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
