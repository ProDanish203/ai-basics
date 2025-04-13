"use server";
import { generateText, streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const getOpenAI = () => {
  if (process.env.OPENAI_API_KEY) {
    return createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  throw new Error("No OpenAI API key found in environment variables.");
};

const getGemini = () => {
  if (process.env.GEMINI_API_KEY) {
    return createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  throw new Error("No Google API key found in environment variables.");
};

export const GenerateText = async (message: string) => {
  const gemini = getGemini();
  const response = await generateText({
    model: gemini("gemini-2.0-flash-exp"),
    prompt: message,
  });

  return response.text;
};

export const StreamText = async (message: string) => {
  const gemini = getGemini();

  const result = await streamText({
    model: gemini("gemini-2.0-flash-exp"),
    prompt: message,
  });

  return result.toDataStreamResponse();
};

export const GetTranscription = async (audioFile: File) => {
  const gemini = getGemini();

  const arrayBuffer = await audioFile.arrayBuffer();
  const base64Audio = Buffer.from(arrayBuffer).toString("base64");
  console.log("Transcribing audio file:", audioFile.name);

  const result = await generateText({
    model: gemini("gemini-2.0-flash-exp"),
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "Transcribe this audio. dont use any other text, the response text should contain only the extracted audio in text form." },
          {
            type: "file",
            mimeType: audioFile.type,
            data: base64Audio,
            filename: audioFile.name,
          },
        ],
      },
    ],
  });

  return result.text;
};
