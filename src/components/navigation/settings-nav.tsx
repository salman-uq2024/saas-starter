"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const tabs = [
  { href: "/settings/profile", label: "Profile" },
  { href: "/settings/workspaces", label: "Workspaces" },
  { href: "/settings/billing", label: "Billing" },
];

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 border-b border-slate-200 pb-2 text-sm font-medium text-slate-600 dark:border-slate-800 dark:text-slate-300">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={clsx(
              "rounded-full px-4 py-1.5 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:hover:bg-slate-800 dark:hover:text-white",
              isActive && "bg-slate-900 text-white dark:bg-white dark:text-slate-900",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
