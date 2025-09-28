"use client";

import { useState, useTransition } from "react";
import { updateProfileAction } from "@/server/actions/profile-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

interface ProfileFormProps {
  defaultName: string;
}

export function ProfileForm({ defaultName }: ProfileFormProps) {
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
      const result = await updateProfileAction(formData);
      if (result.success) {
        setMessage("Profile updated.");
      } else {
        setError(result.error ?? "Failed to update profile");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <label htmlFor="profile-name" className="text-sm font-medium text-slate-600">
          Display name
        </label>
        <Input id="profile-name" name="name" defaultValue={defaultName} required maxLength={80} disabled={isPending} />
      </div>
      {error ? <Alert variant="danger">{error}</Alert> : null}
      {message ? <Alert variant="success">{message}</Alert> : null}
      <Button type="submit" className="w-full sm:w-auto" isLoading={isPending}>
        Save changes
      </Button>
    </form>
  );
}
