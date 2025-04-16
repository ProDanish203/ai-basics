"use client";

import type React from "react";

import { useState } from "react";
import { Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { toast } from "sonner";

interface GeneratedImage {
  base64Data: string;
  mimeType: string;
}

interface ImageGenerationResponse {
  id: string;
  url: string;
  prompt: string;
}

export default function ImageGenerationPage() {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<ImageGenerationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateImages = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    try {
      setIsLoading(true);

      const { data } = await axios.post("/api/image-generation", { prompt });
      if (!data.success)
        return toast.error(data.error || "Failed to generate images");

      const content = data.data.map((image: GeneratedImage) => {
        const url = `data:${image.mimeType};base64,${image.base64Data}`;

        return {
          id: crypto.randomUUID
            ? crypto.randomUUID()
            : Math.random().toString(36).substring(2),
          url,
          prompt,
        };
      });

      setImages(content);
    } catch (error) {
      console.error("Error generating images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        AI Image Generation
      </h1>

      <form onSubmit={handleGenerateImages} className="max-w-3xl mx-auto mb-8">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter a prompt to generate images..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !prompt.trim()}>
            <Wand2 className="h-4 w-4 mr-2" />
            Generate
          </Button>
        </div>
      </form>

      {isLoading && (
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-0">
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!isLoading && images.length > 0 && (
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Generated Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((image, idx) => (
              <Card key={image.id + "-" + idx} className="overflow-hidden">
                <CardContent className="p-0">
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={image.prompt}
                    className="w-full h-auto object-cover aspect-square"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!isLoading && images.length === 0 && (
        <div className="text-center text-muted-foreground mt-12">
          <p>Enter a prompt and click Generate to create images</p>
        </div>
      )}
    </div>
  );
}
