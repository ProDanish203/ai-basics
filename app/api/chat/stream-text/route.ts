import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();
  const gemini = await createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const result = await streamText({
    model: gemini("gemini-2.0-flash-exp"),
    prompt: `give all the answers in plain text format, do no use any sort of markdown or foramtting, just plain text in the response. PROMPT: ${prompt}`,
  });

  return result.toDataStreamResponse();
}
