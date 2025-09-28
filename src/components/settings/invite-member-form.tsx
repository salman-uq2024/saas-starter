"use client";

import { useState, useTransition } from "react";
import { inviteMemberAction } from "@/server/actions/workspace-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

interface InviteMemberFormProps {
  workspaceId: string;
}

export function InviteMemberForm({ workspaceId }: InviteMemberFormProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("workspaceId", workspaceId);

    startTransition(async () => {
      const result = await inviteMemberAction(formData);
      if (result.success) {
        setMessage("Invite sent.");
        form.reset();
      } else {
        setError(result.error ?? "Failed to send invite");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-600" htmlFor="invite-email">
          Email address
        </label>
        <Input id="invite-email" name="email" type="email" placeholder="new teammate" required disabled={isPending} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-600" htmlFor="invite-role">
          Role
        </label>
        <select
          id="invite-role"
          name="role"
          defaultValue="MEMBER"
          disabled={isPending}
          className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          <option value="MEMBER">Member</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>
      {error ? <Alert variant="danger">{error}</Alert> : null}
      {message ? <Alert variant="success">{message}</Alert> : null}
      <Button type="submit" isLoading={isPending} className="w-full sm:w-auto">
        Send invite
      </Button>
    </form>
  );
}
