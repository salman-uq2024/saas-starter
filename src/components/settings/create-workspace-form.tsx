"use client";

import { useState, useTransition } from "react";
import { createWorkspaceAction } from "@/server/actions/workspace-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

export function CreateWorkspaceForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await createWorkspaceAction(formData);
      if (result.success) {
        setMessage("Workspace created.");
        form.reset();
      } else {
        setError(result.error ?? "Failed to create workspace");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <label htmlFor="workspace-name" className="text-sm font-medium text-slate-600">
          Workspace name
        </label>
        <Input id="workspace-name" name="name" placeholder="Acme Corp" required maxLength={80} disabled={isPending} />
      </div>
      {error ? <Alert variant="danger">{error}</Alert> : null}
      {message ? <Alert variant="success">{message}</Alert> : null}
      <Button type="submit" className="w-full sm:w-auto" isLoading={isPending}>
        Create workspace
      </Button>
    </form>
  );
}
