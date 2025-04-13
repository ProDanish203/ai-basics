import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const audioFile = formData.get("file") as File;
    if (!audioFile) {
      return NextResponse.json(
        { message: "No audio file provided" },
        { status: 400 }
      );
    }
    const arrayBuffer = await audioFile.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString("base64");
    console.log("Transcribing audio file:", audioFile.name);

    const gemini = await createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const result = await generateText({
      model: gemini("gemini-2.0-flash-exp"),
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "What is the file about?" },
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

    return NextResponse.json(
      {
        success: true,
        data: result.text,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log("Error in transcribe route:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
