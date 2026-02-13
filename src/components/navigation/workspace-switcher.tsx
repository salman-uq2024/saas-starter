"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { ChevronDown } from "lucide-react";
import { switchWorkspaceAction } from "@/server/actions/workspace-actions";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

interface WorkspaceItem {
  workspace: {
    id: string;
    name: string;
    slug: string;
    plan: string;
  };
}

interface WorkspaceSwitcherProps {
  workspaces: WorkspaceItem[];
  activeWorkspaceId?: string;
}

export function WorkspaceSwitcher({ workspaces, activeWorkspaceId }: WorkspaceSwitcherProps) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSwitch = (workspaceId: string) => {
    const formData = new FormData();
    formData.set("workspaceId", workspaceId);
    setError(null);
    startTransition(async () => {
      const result = await switchWorkspaceAction(formData);
      if (result.success) {
        setOpen(false);
        return;
      }
      setError(result.error ?? "Unable to switch workspace");
    });
  };

  if (!workspaces.length) {
    return <Alert variant="danger">No workspaces found. Create one to get started.</Alert>;
  }

  const activeWorkspace = workspaces.find((member) => member.workspace.id === activeWorkspaceId) ?? workspaces[0];

  return (
    <div className="relative inline-flex" ref={containerRef}>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="min-w-[180px] justify-between"
        isLoading={isPending}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="truncate text-left">{activeWorkspace.workspace.name}</span>
        <ChevronDown className="h-4 w-4" aria-hidden />
      </Button>
      {open ? (
        <div
          role="listbox"
          className="absolute right-0 top-11 z-50 w-56 rounded-lg border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900"
        >
          <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-200">
            {workspaces.map((member) => (
              <li key={member.workspace.id}>
                <button
                  type="button"
                  onClick={() => handleSwitch(member.workspace.id)}
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:hover:bg-slate-800"
                  role="option"
                  aria-selected={member.workspace.id === activeWorkspace?.workspace.id}
                >
                  <span className="truncate">{member.workspace.name}</span>
                  {member.workspace.id === activeWorkspace?.workspace.id ? (
                    <span className="text-xs text-sky-600">Active</span>
                  ) : null}
                </button>
              </li>
            ))}
            <li className="pt-2">
              <Link
                className="flex items-center justify-between rounded-md px-3 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                href="/settings/workspaces"
                onClick={() => setOpen(false)}
              >
                Manage workspaces
              </Link>
            </li>
          </ul>
          {error ? <p className="px-3 pt-2 text-xs text-red-500">{error}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
