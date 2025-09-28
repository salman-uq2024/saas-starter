import type { ReactNode } from "react";
import { MarketingHeader } from "@/components/navigation/marketing-header";
import { MarketingFooter } from "@/components/navigation/marketing-footer";
import { getServerAuthSession } from "@/server/auth";

export default async function MarketingLayout({ children }: { children: ReactNode }) {
  const session = await getServerAuthSession();
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
      <MarketingHeader isAuthenticated={Boolean(session?.user?.id)} />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
