"use client";

import { useEffect, useState, useTransition } from "react";
import type { WorkspaceRole } from "@prisma/client";
import { updateMemberRoleAction } from "@/server/actions/workspace-actions";

interface MemberRoleSelectProps {
  workspaceId: string;
  memberId: string;
  currentRole: WorkspaceRole;
  disabled?: boolean;
}

export function MemberRoleSelect({ workspaceId, memberId, currentRole, disabled }: MemberRoleSelectProps) {
  const [role, setRole] = useState<WorkspaceRole>(currentRole);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setRole(currentRole);
  }, [currentRole]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextRole = event.target.value as WorkspaceRole;
    const previousRole = role;

    setRole(nextRole);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.set("workspaceId", workspaceId);
    formData.set("memberId", memberId);
    formData.set("role", nextRole);

    startTransition(async () => {
      const result = await updateMemberRoleAction(formData);
      if (result.success) {
        setSuccess("Role updated.");
      } else {
        setRole(previousRole);
        setError(result.error ?? "Unable to update role");
      }
    });
  };

  return (
    <div className="space-y-1">
      <select
        value={role}
        onChange={handleChange}
        disabled={disabled || isPending}
        className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium uppercase tracking-wide text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      >
        <option value="OWNER">Owner</option>
        <option value="ADMIN">Admin</option>
        <option value="MEMBER">Member</option>
      </select>
      {error ? <p className="text-[11px] text-red-500">{error}</p> : null}
      {success ? <p className="text-[11px] text-emerald-500">{success}</p> : null}
    </div>
  );
}
