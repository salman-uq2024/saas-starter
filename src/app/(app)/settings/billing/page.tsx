import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/server/auth";
import { getBillingRuntimeInfo, getWorkspaceBillingSummary } from "@/server/billing";
import { listWorkspacesForUser } from "@/server/workspaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BillingActions } from "@/components/settings/billing-actions";
import { EmptyState } from "@/components/ui/empty-state";
import { Alert } from "@/components/ui/alert";

export default async function BillingSettingsPage() {
  const session = await getServerAuthSession();
  if (!session?.user) {
    redirect("/login");
  }

  const memberships = await listWorkspacesForUser(session.user.id);
  const workspaceId = session.user.defaultWorkspaceId ?? memberships[0]?.workspace.id;

  if (!workspaceId) {
    return <EmptyState title="No workspace selected" description="Create a workspace to configure billing." />;
  }

  const workspace = await getWorkspaceBillingSummary(workspaceId);
  if (!workspace) {
    return <EmptyState title="Workspace missing" description="The workspace could not be found." />;
  }

  const billingRuntime = getBillingRuntimeInfo();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <p className="text-sm text-slate-500">Manage billing for {workspace.name}.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
            <span>
              Current plan: <Badge variant="muted">{workspace.plan}</Badge>
            </span>
            <span>
              Billing status: <Badge>{workspace.billingStatus}</Badge>
            </span>
            {workspace.stripeSubscriptionId ? (
              <span className="text-xs text-slate-500">Subscription ID: {workspace.stripeSubscriptionId}</span>
            ) : null}
          </div>
          <BillingActions
            workspaceId={workspace.id}
            plan={workspace.plan}
            billingMode={billingRuntime.mode}
          />
          <p className="text-xs text-slate-500">
            Stripe keys optional: without them we run in stub mode, update workspace plan instantly, and log the intended
            redirect for demos.
          </p>
          {billingRuntime.mode === "live" && !billingRuntime.webhookConfigured ? (
            <Alert className="text-xs">
              Webhook secret missing. Events will not sync subscription status—set `STRIPE_WEBHOOK_SECRET` to enable
              signature verification.
            </Alert>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
