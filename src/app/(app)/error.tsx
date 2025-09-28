"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AppError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-lg border border-red-200 bg-red-50 p-10 text-center text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="text-sm">{error.message}</p>
      <Button onClick={() => reset()} variant="secondary">
        Try again
      </Button>
    </div>
  );
}
