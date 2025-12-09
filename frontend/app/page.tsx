"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

/*
  This is the home page of the app. 
  It displays the two buttons for the students and professors.
*/
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col gap-4">
        <Link href="/students">
          <Button size="lg" variant="outline" className="w-48 border-2">
            Students
          </Button>
        </Link>
        <Link href="/professors">
          <Button size="lg" variant="outline" className="w-48 border-2">
            Professors
          </Button>
        </Link>
        </div>
    </div>
  );
}
