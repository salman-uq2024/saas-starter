"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function AppError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const is404 = error.message?.includes("404");

  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-lg border border-red-200 bg-red-50 p-10 text-center text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
      <AlertCircle className="h-8 w-8" />
      <h2 className="text-lg font-semibold">
        {is404 ? "Page Not Found" : "Something went wrong—try refreshing!"}
      </h2>
      <p className="text-sm">{error.message || (is404 ? "The page you are looking for does not exist." : "Please try again or contact support if the issue persists.")}</p>
      <div className="flex gap-2">
        <Button onClick={() => reset()} variant="secondary">
          Try again
        </Button>
        <Link href="/dashboard">
          <Button variant="secondary">Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
