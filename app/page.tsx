"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatInterface from "@/components/chat-interface";
import TranscriptInterface from "@/components/transcript-interface";
import SummarizePdf from "@/components/summarize-pdf";
import { ToolCalling } from "@/components/tool-calling";

export default function Home() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Vercel AI SDK Demo
      </h1>

      <Tabs defaultValue="generate-text" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="generate-text">Generate Text</TabsTrigger>
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="summarize-pdf">Summarize PDF</TabsTrigger>
          <TabsTrigger value="tool-calling">Tool Calling</TabsTrigger>
        </TabsList>

        <TabsContent value="generate-text">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Generate Text</h2>
            <p className="text-muted-foreground">
              Generate complete text responses using the AI SDK's generateText
              function.
            </p>
          </div>
          <ChatInterface mode="generate" />
        </TabsContent>

        <TabsContent value="transcript">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Audio Transcription</h2>
            <p className="text-muted-foreground">
              Upload audio files and get AI-powered transcriptions.
            </p>
          </div>
          <TranscriptInterface />
        </TabsContent>

        <TabsContent value="summarize-pdf">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Summarize PDF</h2>
            <p className="text-muted-foreground">
              Upload PDF files and get AI-generated summaries.
            </p>
          </div>
          <SummarizePdf />
        </TabsContent>

        <TabsContent value="tool-calling">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              Tool Calling and Agents
            </h2>
            <p className="text-muted-foreground">
              Use the AI SDK to call external tools and APIs, enabling advanced
              interactions and workflows.
            </p>
          </div>
          <ToolCalling />
        </TabsContent>
      </Tabs>
    </div>
  );
}
