import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function BillingSuccessPage() {
  const session = await getServerAuthSession();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <CheckCircle2 className="h-12 w-12 text-emerald-500" aria-hidden />
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Subscription activated</h1>
      <p className="max-w-md text-sm text-slate-500">
        Thanks for upgrading. You&apos;ll see your new plan reflected immediately. Manage billing anytime from the settings area.
      </p>
      <Link href="/settings/billing">
        <Button>Return to billing</Button>
      </Link>
    </div>
  );
}
