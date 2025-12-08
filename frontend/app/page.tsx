"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col gap-4">
        <Link href="/students">
          <Button size="lg" variant="outline" className="w-48 border-2">
            Students
          </Button>
        </Link>
        <Button size="lg" variant="outline" className="w-48 border-2" disabled>
          Professors
        </Button>
      </div>
    </div>
  );
}
