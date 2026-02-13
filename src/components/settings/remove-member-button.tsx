"use client";

import { useState, useTransition } from "react";
import { XCircle } from "lucide-react";
import { removeMemberAction } from "@/server/actions/workspace-actions";
import { Button } from "@/components/ui/button";

interface RemoveMemberButtonProps {
  workspaceId: string;
  memberId: string;
  disabled?: boolean;
}

export function RemoveMemberButton({ workspaceId, memberId, disabled }: RemoveMemberButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!window.confirm("Remove this member from the workspace?")) {
      return;
    }
    setError(null);
    const formData = new FormData();
    formData.set("workspaceId", workspaceId);
    formData.set("memberId", memberId);
    startTransition(async () => {
      const result = await removeMemberAction(formData);
      if (!result.success) {
        setError(result.error ?? "Unable to remove member");
      }
    });
  };

  return (
    <div className="space-y-1 text-right">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        isLoading={isPending}
        disabled={disabled}
        onClick={handleClick}
        aria-label="Remove member"
        className="text-red-600 hover:text-red-600"
      >
        <XCircle className="h-4 w-4" aria-hidden />
      </Button>
      {error ? <p className="text-[11px] text-red-500">{error}</p> : null}
    </div>
  );
}
