import { generateObject, generateText, streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const prompt = formData.get("message") as string;

    if (!file || !prompt) {
      return NextResponse.json(
        { success: false, error: "Invalid input" },
        { status: 400 }
      );
    }

    const gemini = await createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const result = await generateText({
      model: gemini("gemini-2.0-flash-exp"),
      system:
        "You are a helpful assistant that will be helping the user to query and question about the PDF document. Provide the most relevant information from the document. Keep the answers short and concise and in clear text form, do not use markdown or any other format, just use simple text.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "file",
              mimeType: file.type,
              data: await file.arrayBuffer(),
              filename: file.name,
            },
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
    });

    return NextResponse.json({
      success: true,
      data: result.text,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
