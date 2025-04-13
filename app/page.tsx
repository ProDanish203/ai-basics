"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatInterface from "@/components/chat-interface";
import TranscriptInterface from "@/components/transcript-interface";

export default function Home() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Vercel AI SDK Demo
      </h1>

      <Tabs defaultValue="generate-text" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="generate-text">Generate Text</TabsTrigger>
          <TabsTrigger value="stream-text">Stream Text</TabsTrigger>
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
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

        <TabsContent value="stream-text">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Stream Text</h2>
            <p className="text-muted-foreground">
              Stream text responses in real-time using the AI SDK's streamText
              function.
            </p>
          </div>
          <ChatInterface mode="stream" />
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
      </Tabs>
    </div>
  );
}
