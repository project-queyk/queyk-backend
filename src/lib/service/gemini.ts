import { config } from "dotenv";
import { GoogleGenAI } from "@google/genai";

config({ path: ".env.local" });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export default async function generateResponse(
  contents: string,
  systemInstruction: string
) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-lite",
    contents,
    config: {
      systemInstruction,
    },
  });

  return response;
}
