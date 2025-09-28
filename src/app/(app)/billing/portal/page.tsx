import { redirect } from "next/navigation";
import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getServerAuthSession } from "@/server/auth";

interface PortalPageProps {
  searchParams?: Promise<Record<string, string | string[]>>;
}

export default async function BillingPortalStubPage({ searchParams }: PortalPageProps) {
  const session = await getServerAuthSession();
  if (!session?.user) {
    redirect("/login");
  }

  const resolved = (searchParams ? await searchParams : {}) as Record<string, string | string[]>;
  const workspaceIdValue = Array.isArray(resolved.workspaceId)
    ? resolved.workspaceId[0]
    : resolved.workspaceId;
  const modeValue = Array.isArray(resolved.mode) ? resolved.mode[0] : resolved.mode;

  return (
    <div className="space-y-4 py-12">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Billing portal (stub)</h1>
      <Alert variant="default">
        This environment uses stubbed billing, so there&apos;s no real Stripe customer portal. Provision Stripe keys to enable the
        live portal experience.
      </Alert>
      <div className="flex gap-3">
        <Link href="/settings/billing">
          <Button>Return to billing settings</Button>
        </Link>
      </div>
      <p className="text-xs text-slate-500">
        Workspace ID: {workspaceIdValue ?? "unknown"} · Mode: {modeValue ?? "stub"}
      </p>
    </div>
  );
}
