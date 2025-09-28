import Link from "next/link";
import { getPublicEnv } from "@/lib/env";

const publicEnv = getPublicEnv();

export function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900">
      <div className="container flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <p>&copy; {new Date().getFullYear()} {publicEnv.NEXT_PUBLIC_APP_NAME}. All rights reserved.</p>
        <nav className="flex flex-wrap items-center gap-4">
          <Link className="hover:text-slate-900" href="/docs/install">
            Install
          </Link>
          <Link className="hover:text-slate-900" href="/docs/deploy">
            Deploy
          </Link>
          <Link className="hover:text-slate-900" href="/docs/ops">
            Ops
          </Link>
          <Link className="hover:text-slate-900" href="/docs/loom-script">
            Loom Script
          </Link>
        </nav>
      </div>
    </footer>
  );
}
