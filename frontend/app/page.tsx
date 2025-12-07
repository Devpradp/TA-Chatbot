"use client";

import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = 300;
    textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
  }, [message]);

  const handleSend = () => {
    if (message.trim()) {
      // TODO: Handle send message
      console.log("Sending:", message);
      setMessage("");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex-1 w-full px-4 pt-4 sm:px-6 md:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-6xl h-full flex flex-col gap-4">
          {/* Chat Area */}
          <div className="flex-1 bg-gray-200 rounded-lg overflow-y-auto max-h-[calc(100vh-150px)] min-h-[500px] p-6">
            {/* Messages will be rendered here */}
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
