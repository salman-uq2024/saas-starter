"use client";

import { useState, useTransition } from "react";
import { startBillingPortalAction, startCheckoutAction } from "@/server/actions/billing-actions";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

interface BillingActionsProps {
  workspaceId: string;
  plan: string;
}

export function BillingActions({ workspaceId, plan }: BillingActionsProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCheckout = () => {
    setError(null);
    const formData = new FormData();
    formData.set("workspaceId", workspaceId);
    startTransition(async () => {
      const result = await startCheckoutAction(formData);
      if (result.success && result.data?.url) {
        window.location.href = result.data.url;
      } else if (!result.success) {
        setError(result.error ?? "Failed to start checkout");
      }
    });
  };

  const handlePortal = () => {
    setError(null);
    const formData = new FormData();
    formData.set("workspaceId", workspaceId);
    startTransition(async () => {
      const result = await startBillingPortalAction(formData);
      if (result.success && result.data?.url) {
        window.location.href = result.data.url;
      } else if (!result.success) {
        setError(result.error ?? "Failed to open billing portal");
      }
    });
  };

  return (
    <div className="space-y-3">
      {error ? <Alert variant="danger">{error}</Alert> : null}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={handleCheckout} isLoading={isPending} className="w-full sm:w-auto">
          {plan === "PRO" ? "Manage subscription" : "Upgrade to Pro"}
        </Button>
        <Button onClick={handlePortal} variant="secondary" isLoading={isPending} className="w-full sm:w-auto">
          Open billing portal
        </Button>
      </div>
    </div>
  );
}
