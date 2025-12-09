"use client";

import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";

// Interface for the messages in the chatbot
interface Message {
  id: string; // The id of the message
  text: string; // The text of the message
  role: "user" | "bot"; // "user" for the user's messages, "bot" for the chatbot's messages
}

/*
  This is the student's page
  This will be used for the student to chat with the chatbot
 */
export default function StudentsPage() {
  const [message, setMessage] = useState(""); // State that stores the message to send
  const [messages, setMessages] = useState<Message[]>([]); // State that stores the messages
  const [isLoading, setIsLoading] = useState(false); // State that stores the loading state
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Reference to the textarea element
  const chatAreaRef = useRef<HTMLDivElement>(null); // Reference to the chat area element

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
    const userMessage = message.trim(); // Trim the user message to remove any whitespace
    if (!userMessage || isLoading) return; // If the user message is empty or the loading state is true, return

    // Add user message immediately to the messages array
    const userMsg: Message = {
      id: Date.now().toString(),
      text: userMessage,
      role: "user",
    };
    setMessages((prev) => [...prev, userMsg]); // Add the user message to the messages array
    setMessage(""); // Clear the user message input
    setIsLoading(true); // Set the loading state to true until the response is received

    try {
      // Send the user message to the "ask" endpoint in backend
      const response = await fetch("http://localhost:8000/ask", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userMessage }),
      });

      const data = await response.json(); // Parse the response from the backend as JSON

      // Add the bot message to the messages array
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: data.answer,
        role: "bot",
      };
    
      setMessages((prev) => [...prev, botMsg]); // Add the bot message to the messages array
    } catch (error) { // Error handling if the message is not sent successfully
      console.error("Error sending message:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, there was an error processing your message.",
        role: "bot",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false); // Reset the loading state
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
            {messages.length === 0 && ( // If the messages array is empty, show the text "Ask anything about class"
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
            {isLoading && ( // If the loading state is true, show the loading spinner and the text "Thinking..."
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

