import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { NextResponse } from "next/server";
import { createOpenAI } from "@ai-sdk/openai";
import { experimental_generateImage as generateImage } from "ai";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: "Prompt is required" },
        { status: 400 }
      );
    }

    const gemini = await createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const result = await generateText({
      model: gemini("gemini-2.0-flash-exp"),
      providerOptions: {
        google: { responseModalities: ["TEXT", "IMAGE"] },
      },
      prompt: `Generate 4 images based on the prompt: ${prompt}`,
    });
    const isSuccessResponse =
      result.text.trim() === "" || result.text === "\n\n\n\n";

    if (isSuccessResponse && result.files && result.files.length > 0) {
      return NextResponse.json({
        success: true,
        data: result.files,
        message: "Images generated successfully",
      });
    } else {
      return NextResponse.json({
        success: false,
        error: isSuccessResponse ? "No images were generated" : result.text,
        data: [],
      });
    }

    //  // OpenAI Implementation

    // const openai = await createOpenAI({
    //   apiKey: process.env.OPENAI_API_KEY,
    // });

    // const { images, warnings } = await generateImage({
    //   model: openai.image("dall-e-3"),
    //   prompt,
    //   size: "1024x1024",
    //   aspectRatio: "16:9",
    //   n: 4,
    //   providerOptions: {
    //     openai: { style: "vivid", quality: "hd" },
    //   },
    //   //   seed: 1234567890,
    // });

    // return NextResponse.json({
    //   success: true,
    //   data: images,
    // });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
