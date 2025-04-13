"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Upload, X, FileText } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function SummarizePdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (selectedFile.type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        return;
      }

      setFile(selectedFile);
      setSummary("");
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setSummary("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      setIsProcessing(true);
      setSummary("");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/chat/summarize-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        return toast.error("Error summarizing the PDF. Please try again.");
      }

      setSummary(data.summary);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        console.log("Request was aborted");
      } else {
        console.error(err);
        toast.error("Error summarizing the PDF. Please try again.");
      }
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
                  <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload a PDF file to summarize
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    click to select (max 10MB)
                  </p>
                  <label
                    htmlFor="pdf-upload"
                    className={cn(
                      buttonVariants({
                        variant: "outline",
                      })
                    )}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Select PDF
                  </label>
                  <input
                    id="pdf-upload"
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </>
              ) : (
                <div className="w-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      <span className="text-sm font-medium truncate max-w-[200px]">
                        {file.name}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
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
                    {isProcessing ? "Processing..." : "Summarize PDF"}
                  </Button>
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {(summary || isProcessing) && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2">Summary</h3>
            <Textarea
              value={summary || "Processing..."}
              readOnly
              className="min-h-[300px] resize-none"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
