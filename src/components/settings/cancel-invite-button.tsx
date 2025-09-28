"use client";

import { useTransition } from "react";
import { cancelInviteAction } from "@/server/actions/workspace-actions";
import { Button } from "@/components/ui/button";

interface CancelInviteButtonProps {
  workspaceId: string;
  inviteId: string;
}

export function CancelInviteButton({ workspaceId, inviteId }: CancelInviteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleCancel = () => {
    const formData = new FormData();
    formData.set("workspaceId", workspaceId);
    formData.set("inviteId", inviteId);
    startTransition(async () => {
      await cancelInviteAction(formData);
    });
  };

  return (
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
  );
}
