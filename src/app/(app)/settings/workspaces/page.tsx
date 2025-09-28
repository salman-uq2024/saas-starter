import Link from "next/link";
import { getServerAuthSession } from "@/server/auth";
import { listWorkspacesForUser } from "@/server/workspaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreateWorkspaceForm } from "@/components/settings/create-workspace-form";

export default async function WorkspaceSettingsPage() {
  const session = await getServerAuthSession();
  if (!session?.user) {
    return null;
  }

  const memberships = await listWorkspacesForUser(session.user.id);

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Your workspaces</CardTitle>
          <p className="text-sm text-slate-500">Select a workspace to manage members, invites, and billing.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {memberships.length === 0 ? (
            <p className="text-sm text-slate-500">You have no workspaces yet. Create one to get started.</p>
          ) : (
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              {memberships.map((membership) => (
                <li
                  key={membership.workspace.id}
                  className="flex flex-col gap-1 rounded-lg border border-slate-200 px-4 py-3 transition hover:border-sky-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-800/40 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{membership.workspace.name}</p>
                    <p className="text-xs text-slate-500">Role: {membership.role}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="muted">{membership.workspace.plan}</Badge>
                    <Link
                      className="text-xs font-semibold text-sky-600 hover:underline"
                      href={`/settings/workspaces/${membership.workspace.id}`}
                    >
                      Manage →
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Create a workspace</CardTitle>
          <p className="text-sm text-slate-500">Provision a fresh space for a new client or internal project.</p>
        </CardHeader>
        <CardContent>
          <CreateWorkspaceForm />
        </CardContent>
      </Card>
    </div>
  );
}
