import * as React from "react"
import { cn } from "@/lib/utils"

/* 
  This component is the text area component for the chatbot where the user can type their messages to the chatbot.
*/
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
    // This is the class name for the text area. It is a combination of the base class name and the class name passed in from the parent component.
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props} // These are the properties passed in from the parent component to edit style and functionality.
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea } // Export the component
