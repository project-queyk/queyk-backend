import { config } from "dotenv";
import Anthropic from "@anthropic-ai/sdk";

config({ path: ".env.local" });

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function generateResponse(
  contents: string,
  systemInstruction: string
): Promise<string> {
  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    system: systemInstruction,
    messages: [
      {
        role: "user",
        content: contents,
      },
    ],
  });

  const textContent = response.content.find((block) => block.type === "text");
  return textContent && textContent.type === "text" ? textContent.text : "";
}
