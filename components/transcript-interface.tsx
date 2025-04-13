"use client";

import type React from "react";

import { useState } from "react";
import { Upload, X, FileAudio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { GetTranscription } from "@/lib/actions/ai";

export default function TranscriptInterface() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setTranscript(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setTranscript(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (!file) return;
      setIsProcessing(true);

      const response = await GetTranscription(file);
      setTranscript(response);
    } catch (err) {
      console.log(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
              {!file ? (
                <>
                  <FileAudio className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload an audio file to transcribe
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Supports MP3, WAV, M4A (max 25MB)
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
                    }
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Select File
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </>
              ) : (
                <div className="w-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <FileAudio className="h-5 w-5 mr-2 text-primary" />
                      <span className="text-sm font-medium truncate max-w-[200px]">
                        {file.name}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleRemoveFile}
                      disabled={isProcessing}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Transcribe Audio"}
                  </Button>
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {transcript && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2">Transcript</h3>
            <Textarea
              value={transcript}
              readOnly
              className="min-h-[200px] resize-none"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
