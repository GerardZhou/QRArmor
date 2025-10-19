import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch from "node-fetch";
import * as cheerio from "cheerio";

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
if (!apiKey) throw new Error("Missing GOOGLE_GEMINI_API_KEY");
const genAI = new GoogleGenerativeAI(apiKey);

export async function summarizeWithGemini(url: string) {
  // 1️⃣ Fetch HTML from the target webpage
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
  const html = await response.text();

  // 2️⃣ Parse HTML and extract text
  const $ = cheerio.load(html);
  const text = $("p, h1, h2, h3").map((_, el) => $(el).text()).get().join(" ");

  // 3️⃣ Clean text to stay under Gemini's input limit
  const cleanedText = text.replace(/\s+/g, " ").trim().slice(0, 8000);

  // 4️⃣ Ask Gemini to summarize
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(cleanedText);
    const response = await result.response;
    return response.text() || "No summary available.";
  } catch (error) {
    console.error('Gemini API error:', error);
    return "Failed to generate summary.";
  }
}