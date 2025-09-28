"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings } from "lucide-react";
import { clsx } from "clsx";

export const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 flex-shrink-0 border-r border-slate-200 bg-white/80 px-4 py-6 dark:border-slate-800 dark:bg-slate-900/80 md:flex">
      <nav className="flex w-full flex-col gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "inline-flex items-center gap-2 rounded-lg px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:hover:bg-slate-800 dark:hover:text-white",
                isActive ? "bg-slate-900/5 text-slate-900 dark:bg-white/10 dark:text-white" : undefined,
              )}
            >
              <item.icon className="h-4 w-4" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
