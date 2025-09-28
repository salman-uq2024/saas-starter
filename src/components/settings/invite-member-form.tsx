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
  const [acceptUrl, setAcceptUrl] = useState<string | null>(null);
  const [delivered, setDelivered] = useState<boolean | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setAcceptUrl(null);
    setDelivered(null);
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("workspaceId", workspaceId);

    startTransition(async () => {
      const result = await inviteMemberAction(formData);
      if (result.success) {
        const resultUrl = result.data?.acceptUrl ?? null;
        const didDeliver = result.data?.delivered ?? false;
        setMessage(didDeliver ? "Invite sent." : "Invite ready. Share the link below to accept locally.");
        setAcceptUrl(resultUrl);
        setDelivered(didDeliver);
        form.reset();
      } else {
        setError(result.error ?? "Failed to send invite");
      }
    });
  };

  const handleCopyLink = async () => {
    if (!acceptUrl) {
      return;
    }
    try {
      await navigator.clipboard.writeText(acceptUrl);
      setMessage("Invite link copied to clipboard.");
    } catch {
      setError("Unable to copy link. Copy it manually below.");
    }
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
      {acceptUrl ? (
        <div className="space-y-2 rounded-md border border-dashed border-slate-300 p-3 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-300">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-slate-600 dark:text-slate-200">Invite link</span>
            <Button type="button" size="sm" variant="secondary" onClick={handleCopyLink}>
              Copy link
            </Button>
          </div>
          <code className="block break-all text-slate-600 dark:text-slate-200">{acceptUrl}</code>
          {delivered === false ? (
            <p className="text-[11px] text-slate-400">
              Email isn&apos;t configured, so share this link with your teammate to let them accept the invite.
            </p>
          ) : null}
        </div>
      ) : null}
      <Button type="submit" isLoading={isPending} className="w-full sm:w-auto">
        Send invite
      </Button>
    </form>
  );
}
