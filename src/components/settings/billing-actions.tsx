"use client";

import { useState, useTransition } from "react";
import { startBillingPortalAction, startCheckoutAction } from "@/server/actions/billing-actions";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

interface BillingActionsProps {
  workspaceId: string;
  plan: string;
  billingMode: "live" | "stub";
}

export function BillingActions({ workspaceId, plan, billingMode }: BillingActionsProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isPro = plan === "PRO";
  const inStubMode = billingMode === "stub";

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
        {isPro ? (
          <>
            <Button onClick={handlePortal} isLoading={isPending} className="w-full sm:w-auto">
              Manage subscription
            </Button>
            <Button
              onClick={handleCheckout}
              variant="secondary"
              isLoading={isPending}
              className="w-full sm:w-auto"
              disabled={inStubMode}
            >
              New checkout session
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleCheckout} isLoading={isPending} className="w-full sm:w-auto">
              Upgrade to Pro
            </Button>
            <Button
              onClick={handlePortal}
              variant="secondary"
              className="w-full sm:w-auto"
              disabled
            >
              Manage subscription
            </Button>
          </>
        )}
      </div>
      {inStubMode ? (
        <Alert>
          Running in Stripe stub mode. Add test keys for `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID_PRO`, and
          `STRIPE_WEBHOOK_SECRET` to enable live checkout and portal redirects.
        </Alert>
      ) : null}
    </div>
  );
}
