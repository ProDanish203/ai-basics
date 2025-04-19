"use client";

import type React from "react";

import {
  useState,
  useEffect,
  useRef,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Upload, Send, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const ChatWithPdfPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  const handleRemoveFile = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    setFile(null);
    setPdfUrl(null);
    setMessages([]);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (selectedFile.type !== "application/pdf") {
        alert("Please upload a PDF file");
        return;
      }

      setFile(selectedFile);

      setMessages([
        {
          id: Date.now().toString(),
          role: "assistant",
          content: `I've loaded "${selectedFile.name}". What would you like to know about this document?`,
        },
      ]);
    }
  };

  const handleSendMessage = async (e: FormEvent) => {
    try {
      e.preventDefault();
      if (!input.trim() || !file) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: input,
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("message", input);

      const { data } = await axios.post("/api/chat-with-pdf", formData);

      if (!data.success) return toast.error("Error: " + data.message);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.data,
        },
      ]);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error ||
          "An error occurred while processing your request."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto py-8 px-4">
      {!file ? (
        <div className="flex justify-center items-center min-h-[80vh]">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">Upload a PDF</h2>
                <p className="text-sm text-muted-foreground mb-6 text-center">
                  Drag and drop your PDF file here, or click to browse
                </p>
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("pdf-upload")?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Select PDF
                </Button>
                <input
                  id="pdf-upload"
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[80vh]">
          <div className="border rounded-lg overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-muted/30">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                <span className="font-medium truncate max-w-[200px]">
                  {file.name}
                </span>
                <span className="text-xs text-muted-foreground ml-2">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleRemoveFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 bg-muted/10 flex items-center justify-center p-4">
              {pdfUrl && (
                <iframe
                  src={pdfUrl + "#toolbar=0"}
                  className="w-full h-full border rounded"
                  title="PDF Viewer"
                />
              )}
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden flex flex-col">
            <div className="p-4 border-b bg-muted/30">
              <h2 className="font-medium">Chat with PDF</h2>
            </div>

            <div className="flex-1 p-4 overflow-y-scroll max-h-[70vh]">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-lg max-w-[80%] ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-muted-foreground px-4 py-2 rounded-lg">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
                        <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleSendMessage} className="border-t p-4">
              <div className="flex gap-2 w-full h-16">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question about the PDF..."
                  className="min-h-[60px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-full w-14"
                  disabled={isLoading || !input.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default ChatWithPdfPage;
