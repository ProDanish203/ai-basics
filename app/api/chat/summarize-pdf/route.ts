import { generateObject, streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    console.log("Summarizing PDF:", file.name);

    const gemini = await createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const result = await generateObject({
      model: gemini("gemini-2.0-flash-exp"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze the following PDF and generate a summary.",
            },
            {
              type: "file",
              mimeType: file.type,
              data: await file.arrayBuffer(),
              filename: file.name,
            },
          ],
        },
      ],
      schema: z.object({
        summary: z.string().describe("A 50 word sumamry of the PDF."),
      }),
    });

    return NextResponse.json({
      success: true,
      summary: result.object.summary,
    });
  } catch (err) {
    console.log("Error in summarize-pdf route:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
