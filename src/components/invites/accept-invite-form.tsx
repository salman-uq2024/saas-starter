"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { acceptInviteAction } from "@/server/actions/workspace-actions";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

interface AcceptInviteFormProps {
  token: string;
}

export function AcceptInviteForm({ token }: AcceptInviteFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.set("token", token);
      const result = await acceptInviteAction(formData);
      if (result.success) {
        setSuccess("Invitation accepted! Redirecting to your workspace...");
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error ? <Alert variant="danger">{error}</Alert> : null}
      {success ? <Alert variant="success">{success}</Alert> : null}
      <input type="hidden" name="token" value={token} readOnly />
      <Button type="submit" isLoading={isPending} className="w-full">
        Accept invitation
      </Button>
    </form>
  );
}
