import Link from "next/link";
import { redirect } from "next/navigation";
import { Sparkles, Users, Shield, Receipt } from "lucide-react";
import { getServerAuthSession } from "@/server/auth";
import { getDashboardData } from "@/server/dashboard";
import { listWorkspacesForUser } from "@/server/workspaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";

export default async function DashboardPage() {
  const session = await getServerAuthSession();
  if (!session?.user) {
    redirect("/login");
  }

  const memberships = await listWorkspacesForUser(session.user.id);
  const activeWorkspaceId = session.user.defaultWorkspaceId ?? memberships[0]?.workspace.id;

  if (!activeWorkspaceId) {
    return (
      <EmptyState
        title="No workspace yet"
        description="Create your first workspace to unlock dashboards, invites, and billing."
        className="mt-10"
      />
    );
  }

  const dashboard = await getDashboardData(session.user.id, activeWorkspaceId);

  const statusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "success" as const;
      case "PAST_DUE":
        return "danger" as const;
      default:
        return "muted" as const;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Welcome back, {session.user.name ?? session.user.email}</h1>
          <p className="text-sm text-slate-500">
            You&apos;re viewing the <strong>{dashboard.workspace.name}</strong> workspace.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/settings/workspaces">
            <Button variant="secondary">Manage workspaces</Button>
          </Link>
          <Link href="/settings/billing">
            <Button>Billing & subscriptions</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-slate-500">Plan</CardTitle>
            <Sparkles className="h-4 w-4 text-sky-500" aria-hidden />
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {dashboard.metrics.plan}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-slate-500">Members</CardTitle>
            <Users className="h-4 w-4 text-sky-500" aria-hidden />
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {dashboard.metrics.memberCount}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-slate-500">Pending invites</CardTitle>
            <Shield className="h-4 w-4 text-sky-500" aria-hidden />
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {dashboard.metrics.pendingInvites}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-slate-500">Billing status</CardTitle>
            <Receipt className="h-4 w-4 text-sky-500" aria-hidden />
          </CardHeader>
          <CardContent className="text-base">
            <Badge variant={statusColor(dashboard.metrics.billingStatus)}>{dashboard.metrics.billingStatus}</Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Team members</CardTitle>
            <p className="text-sm text-slate-500">Active members in this workspace and their roles.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboard.workspace.memberships.length === 0 ? (
              <EmptyState title="No members yet" description="Invite teammates from the settings area." />
            ) : (
              <ul className="space-y-3">
                {dashboard.workspace.memberships.map((member) => (
                  <li key={member.userId} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-800/50">
                    <div className="flex items-center gap-3">
                      <Avatar name={member.user.name ?? member.user.email ?? "Member"} src={member.user.image} />
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {member.user.name ?? member.user.email}
                        </p>
                        <p className="text-xs text-slate-500">{member.user.email}</p>
                      </div>
                    </div>
                    <Badge variant={member.role === "OWNER" ? "default" : member.role === "ADMIN" ? "success" : "muted"}>
                      {member.role}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Pending invites</CardTitle>
            <p className="text-sm text-slate-500">Track outstanding invitations and resend if needed.</p>
          </CardHeader>
          <CardContent>
            {dashboard.workspace.invites.length === 0 ? (
              <EmptyState title="No pending invites" description="Invite teammates from settings → workspaces." />
            ) : (
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                {dashboard.workspace.invites.map((invite) => (
                  <li key={invite.id} className="rounded-lg border border-slate-200/80 px-4 py-3 dark:border-slate-800/80">
                    <p className="font-medium text-slate-900 dark:text-slate-100">{invite.email}</p>
                    <p className="text-xs text-slate-500">Role: {invite.role}</p>
                    <p className="text-xs text-slate-500">
                      Expires {invite.expiresAt.toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Audit trail</CardTitle>
          <p className="text-sm text-slate-500">Recent activity recorded across the workspace.</p>
        </CardHeader>
        <CardContent>
          {dashboard.auditTrail.length === 0 ? (
            <EmptyState title="No audit records yet" description="Actions across billing, invites, and membership appear here." />
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>Action</TH>
                  <TH>Actor</TH>
                  <TH>Target</TH>
                  <TH>Date</TH>
                </TR>
              </THead>
              <TBody>
                {dashboard.auditTrail.map((entry) => (
                  <TR key={entry.id}>
                    <TD>{entry.action}</TD>
                    <TD>{entry.actorId ?? "System"}</TD>
                    <TD>{entry.target ?? "—"}</TD>
                    <TD>{new Date(entry.createdAt).toLocaleString()}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
