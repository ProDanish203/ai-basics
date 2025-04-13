import { NextResponse, NextRequest } from "next/server";
import { generateText, UIMessage } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const POST = async (req: NextRequest) => {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    if (!messages)
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );

    const gemini = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const { response } = await generateText({
      model: gemini("gemini-2.0-flash-exp"),
      messages,
    });

    return NextResponse.json(
      { success: true, messages: response.messages },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
