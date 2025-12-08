"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";

export default function ProfessorsPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFiles((prev) => [...prev, selectedFile]);
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSend = async () => {
    setIsLoading(true);
    setSuccessMessage(null);

    try {
      // Placeholder API call with 5 second delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Placeholder - replace with actual API call
      // const formData = new FormData();
      // files.forEach((file) => {
      //   formData.append("files", file);
      // });
      // const response = await fetch("/api/upload", {
      //   method: "POST",
      //   body: formData,
      // });
      // const data = await response.json();

      // Clear files after successful send
      setFiles([]);
      setSuccessMessage("Files sent successfully!");
    } catch (error) {
      console.error("Error sending files:", error);
      setSuccessMessage("Error sending files. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col gap-6 items-center">
        {/* File List */}
        {files.length > 0 && (
          <div className="w-full max-w-md">
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="bg-gray-200 rounded-lg px-4 py-2 text-sm"
                >
                  {file.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Button */}
        <Button size="lg" onClick={handleUploadClick} className="w-48">
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>

        {/* Send Button */}
        <Button
          size="lg"
          onClick={handleSend}
          disabled={isLoading}
          className="w-48"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send"
          )}
        </Button>

        {/* Success Message */}
        {successMessage && (
          <div
            className={`text-sm mt-2 ${
              successMessage.includes("Error")
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {successMessage}
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          accept="*/*"
        />
      </div>
    </div>
  );
}

