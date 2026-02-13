"use client";

import { useState, useTransition } from "react";
import { cancelInviteAction } from "@/server/actions/workspace-actions";
import { Button } from "@/components/ui/button";

interface CancelInviteButtonProps {
  workspaceId: string;
  inviteId: string;
}

export function CancelInviteButton({ workspaceId, inviteId }: CancelInviteButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCancel = () => {
    if (!window.confirm("Cancel this invite? The link will stop working immediately.")) {
      return;
    }
    setError(null);
    const formData = new FormData();
    formData.set("workspaceId", workspaceId);
    formData.set("inviteId", inviteId);
    startTransition(async () => {
      const result = await cancelInviteAction(formData);
      if (!result.success) {
        setError(result.error ?? "Unable to cancel invite");
      }
    });
  };

  return (
    <div className="space-y-1 text-right">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleCancel}
        isLoading={isPending}
        aria-label="Cancel invite"
        className="text-red-600 hover:text-red-600"
      >
        Cancel
      </Button>
      {error ? <p className="text-[11px] text-red-500">{error}</p> : null}
    </div>
  );
}
