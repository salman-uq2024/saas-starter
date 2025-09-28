"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import type { WorkspaceRole } from "@prisma/client";
import { NAV_ITEMS } from "@/components/navigation/app-sidebar";
import { WorkspaceSwitcher } from "@/components/navigation/workspace-switcher";
import { UserMenu } from "@/components/navigation/user-menu";
import { Button } from "@/components/ui/button";

interface WorkspaceMemberLite {
  workspace: {
    id: string;
    name: string;
    slug: string;
    plan: string;
  };
  role?: WorkspaceRole;
}

interface AppTopbarProps {
  workspaces: WorkspaceMemberLite[];
  activeWorkspaceId?: string;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function AppTopbar({ workspaces, activeWorkspaceId, user }: AppTopbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
          </Button>
          <WorkspaceSwitcher workspaces={workspaces} activeWorkspaceId={activeWorkspaceId} />
        </div>
        <UserMenu name={user.name} email={user.email} image={user.image} />
      </div>
      {mobileOpen ? (
        <nav className="space-y-1 border-t border-slate-200 px-4 py-4 text-sm font-medium text-slate-600 dark:border-slate-800 dark:text-slate-200 md:hidden">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              <item.icon className="mr-2 inline h-4 w-4" aria-hidden />
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
