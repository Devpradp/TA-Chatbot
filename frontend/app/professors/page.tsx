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
    fileInputRef.current?.click(); // Click the file input to open the file selector
  };

  const handleSend = async () => {
    setIsLoading(true); // Set the loading state to true until the files are sent successfully
    setSuccessMessage(null);

    try { 
      // Convert the files to a form data object (converts HTML form data to a JSON object)
      const formData = new FormData();
      files.forEach((file)=> {
        formData.append("file", file);
      });

      const textContents = []; // Array to store the text contents of the files

      // Read the text contents of the files
      for (const file of files){
        const fileText = await file.text();
        textContents.push(fileText);
      }

      const combinedText = textContents.join("\n\n"); // Combine the text contents of the files into a single string

      // Send the text contents to the "upload_slides" endpoint in backend
      const response = await fetch("http://localhost:8000/upload_slides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({text: combinedText}),
      });

      const data = await response.json() // Parse the response from the backend as JSON

      // Clear files after successful send
      setFiles([]);
      setSuccessMessage("Files sent successfully!");
    } catch (error) { // Error handling if the files are not sent successfully
      console.error("Error sending files:", error);
      setSuccessMessage("Error sending files. Please try again.");
    } finally {
      setIsLoading(false); // Reset the loading state
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
          {isLoading ? ( // If the loading state is true, show the loading spinner and the text "Sending..."
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send"
          )}
        </Button>

        {/* Success Message */}
        {successMessage && ( // If the success message is not null, show the success message
          <div
            className={`text-sm mt-2 ${
              successMessage.includes("Error") 
                ? "text-red-600" // If the success message contains the word "Error", show the text in red
                : "text-green-600" // If the success message does not contain the word "Error", show the text in green
            }`}
          >
            {successMessage}
          </div>
        )}

        {/* Hidden File Input */}
        <input // Hidden file input to select the files to upload
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

