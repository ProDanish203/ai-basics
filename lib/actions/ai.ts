"use server";
import {
  CoreMessage,
  generateObject,
  generateText,
  LanguageModel,
  streamText,
  tool,
} from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { z } from "zod";

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

  // const openai = getOpenAI();
  // const response = await generateText({
  //   model: openai("gpt-3.5-turbo"),
  //   prompt: message,
  // });

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
          {
            type: "text",
            text: "Transcribe this audio. dont use any other text, the response text should contain only the extracted audio in text form.",
          },
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

const otherProperties = async (
  prompt = "Give me a list of all the properties you have in your system."
) => {
  const gemini = getGemini();
  const { text, files, warnings, finishReason, sources } = await generateText({
    model: gemini("gemini-2.0-flash-exp"),
    prompt,
    system: `You are an AI code reviewer`,
    messages: [
      {
        role: "system",
        content: `You are an AI code reviewer. You will be given a code snippet and you will review it and give me a list of all the properties you have in your system.`,
      },
      { role: "user", content: prompt },
    ],
  });
};

const switchModels = async (model: LanguageModel, prompt: string) => {
  const { text, files } = await generateText({
    model,
    prompt,
  });
};

const messages: CoreMessage[] = [
  { role: "system", content: "You are an AI assistant." },
  { role: "user", content: "Hello" },
  {
    role: "assistant",
    content: "Hello! How can I assist you today?",
  },
];

const preserveContext = async (model: LanguageModel, prompt: string) => {
  const { text, files } = await generateText({
    model,
    prompt,
  });
};

const localModel = async (prompt: string) => {
  const lmstudio = createOpenAICompatible({
    name: "lmstudio",
    baseURL: "http://localhost:8080",
    apiKey: "your_api_key",
    headers: {
      Authorization: "Bearer your_api_key",
    },
  });

  const model = lmstudio(""); // Empty string for Default model
  const { text } = await generateText({
    model,
    prompt,
    maxRetries: 0,
  });
  return text;
};

const classifySentiment = async (prompt: string) => {
  const gemini = getGemini();
  const result = await generateObject({
    model: gemini("gemini-2.0-flash-exp"),
    prompt: `Classify the sentiment of the following text: "${prompt}"`,
    schema: z.object({
      sentiment: z
        .enum(["positive", "negative", "neutral"])
        .describe("The sentiment of the text."),
    }),
    schemaName: "Sentiment",
    schemaDescription: "Classify the sentiment of the text.",
  });
  return result.object.sentiment;
};

const logToConsoleTool = tool({
  parameters: z.object({
    message: z.string().describe("The message to log to the console."),
  }),
  description: "Logs a message to the console.",
  type: "function",
  execute: async ({ message }) => {
    console.log("Logging to console:", message);
    return `Logged to console: ${message}`;
  },
});

export const logToConsole = async (prompt: string) => {
  const gemini = getGemini();
  const { steps, text } = await generateText({
    model: gemini("gemini-2.0-flash-exp"),
    prompt,
    system: "You are an AI code reviewer.",
    tools: {
      logToConsole: logToConsoleTool,
    },
  });

  // console.log("Steps:", JSON.stringify(steps, null, 2));

  return text;
};

const getWeatherTool = tool({
  description: "Get the current weather for a given city.",
  parameters: z.object({
    city: z.string().describe("The city to get the weather for."),
  }),
  type: "function",
  execute: async ({ city }) => {
    // Simulate an API call to get the weather
    const weather = `The current weather in ${city} is sunny with a temperature of 25°C.`;
    return weather;
  },
});

export const askWeather = async (prompt: string) => {
  const gemini = getGemini();
  const { text, steps } = await generateText({
    model: gemini("gemini-2.0-flash-exp"),
    prompt,
    system: "You are an AI code reviewer.",
    tools: {
      getWeather: getWeatherTool,
    },
    maxSteps: 2,
  });

  // console.log("Steps:", JSON.stringify(steps, null, 2));

  return text;
};
