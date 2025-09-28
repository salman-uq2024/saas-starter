"use client";

import { useState, useTransition } from "react";
import { renameWorkspaceAction } from "@/server/actions/workspace-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

interface RenameWorkspaceFormProps {
  workspaceId: string;
  defaultName: string;
}

export function RenameWorkspaceForm({ workspaceId, defaultName }: RenameWorkspaceFormProps) {
  const [name, setName] = useState(defaultName);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const formData = new FormData();
    formData.set("workspaceId", workspaceId);
    formData.set("name", name);

    startTransition(async () => {
      const result = await renameWorkspaceAction(formData);
      if (result.success) {
        setMessage("Workspace name updated.");
      } else {
        setError(result.error ?? "Failed to rename workspace");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3" noValidate>
      <div className="space-y-1">
        <label htmlFor="workspace-name" className="text-sm font-medium text-slate-600">
          Workspace name
        </label>
        <Input
          id="workspace-name"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          maxLength={80}
          disabled={isPending}
        />
      </div>
      {error ? <Alert variant="danger">{error}</Alert> : null}
      {message ? <Alert variant="success">{message}</Alert> : null}
      <Button type="submit" isLoading={isPending} className="w-full sm:w-auto">
        Save name
      </Button>
    </form>
  );
}
