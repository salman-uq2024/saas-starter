import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPublicEnv } from "@/lib/env";

const publicEnv = getPublicEnv();

interface MarketingHeaderProps {
  isAuthenticated: boolean;
}

export function MarketingHeader({ isAuthenticated }: MarketingHeaderProps) {

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-600 text-white">SS</span>
            <span>{publicEnv.NEXT_PUBLIC_APP_NAME}</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            <Link className="hover:text-slate-900" href="#features">
              Features
            </Link>
            <Link className="hover:text-slate-900" href="#security">
              Security
            </Link>
            <Link className="hover:text-slate-900" href="#pricing">
              Pricing
            </Link>
            <Link className="hover:text-slate-900" href="/docs">
              Docs
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link className="text-sm font-medium text-slate-600 hover:text-slate-900" href="/docs/loom-script">
            Demo Script
          </Link>
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button size="sm" variant="secondary">
                Go to dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button size="sm">Sign in</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
