"use client";

import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";

interface Message {
  id: string;
  text: string;
  role: "user" | "bot";
}

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = 300;
    textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
  }, [message]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    const userMessage = message.trim();
    if (!userMessage || isLoading) return;

    // Add user message immediately
    const userMsg: Message = {
      id: Date.now().toString(),
      text: userMessage,
      role: "user",
    };
    setMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setIsLoading(true);

    try {
      // Placeholder API call with 2 second delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Placeholder response - replace with actual API call

      // Placeholder bot response
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: `This is a placeholder response. Replace this with your actual API response.`,
        role: "bot",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, there was an error processing your message.",
        role: "bot",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex-1 w-full px-4 pt-4 sm:px-6 md:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-6xl h-full flex flex-col gap-4">
          {/* Chat Area */}
          <div
            ref={chatAreaRef}
            className="flex-1 bg-gray-200 rounded-lg overflow-y-auto max-h-[calc(100vh-150px)] min-h-[500px] p-6 flex flex-col gap-4"
          >
            {messages.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-gray-500 text-sm"></div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-white text-foreground border border-gray-300"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {msg.text}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-foreground border border-gray-300 rounded-lg px-4 py-2 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                  <span className="text-sm text-gray-500">Thinking...</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Textarea and Send Button */}
          <div className="w-full flex gap-3 items-end">
            <div className="flex-1">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask anything about class"
                className="resize-none min-h-[44px] max-h-[300px] overflow-y-auto"
                rows={1}
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={!message.trim()}
              size="icon"
              variant="outline"
              className="h-[44px] w-[44px] rounded-full shrink-0 border-2"
              aria-label="Send message"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
