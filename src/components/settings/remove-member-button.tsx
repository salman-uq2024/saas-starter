"use client";

import { useTransition } from "react";
import { XCircle } from "lucide-react";
import { removeMemberAction } from "@/server/actions/workspace-actions";
import { Button } from "@/components/ui/button";

interface RemoveMemberButtonProps {
  workspaceId: string;
  memberId: string;
  disabled?: boolean;
}

export function RemoveMemberButton({ workspaceId, memberId, disabled }: RemoveMemberButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    const formData = new FormData();
    formData.set("workspaceId", workspaceId);
    formData.set("memberId", memberId);
    startTransition(async () => {
      await removeMemberAction(formData);
    });
  };

  return (
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
  );
}
