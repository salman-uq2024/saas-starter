import { notFound } from "next/navigation";
import { getServerAuthSession } from "@/server/auth";
import { getWorkspaceSummary } from "@/server/workspaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InviteMemberForm } from "@/components/settings/invite-member-form";
import { CancelInviteButton } from "@/components/settings/cancel-invite-button";
import { RemoveMemberButton } from "@/components/settings/remove-member-button";
import { EmptyState } from "@/components/ui/empty-state";

interface WorkspaceDetailsPageProps {
  params: Promise<{ workspaceId: string }>;
}

export default async function WorkspaceDetailsPage({ params }: WorkspaceDetailsPageProps) {
  const { workspaceId } = await params;
  const session = await getServerAuthSession();
  if (!session?.user) {
    return null;
  }

  const workspace = await getWorkspaceSummary(workspaceId);
  if (!workspace) {
    notFound();
  }

  const currentMembership = workspace.memberships.find((member) => member.userId === session.user.id);
  const canManage = currentMembership && currentMembership.role !== "MEMBER";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{workspace.name}</h2>
        <p className="text-sm text-slate-500">Manage members, roles, and outstanding invitations.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Members</CardTitle>
            <p className="text-sm text-slate-500">Remove teammates or view their roles.</p>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            {workspace.memberships.length === 0 ? (
              <EmptyState title="No members" description="Invite teammates using the form on the right." />
            ) : (
              <ul className="space-y-2">
                {workspace.memberships.map((member) => (
                  <li
                    key={member.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-800"
                  >
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{member.user.name ?? member.user.email}</p>
                      <p className="text-xs text-slate-500">{member.user.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={member.role === "OWNER" ? "default" : member.role === "ADMIN" ? "success" : "muted"}>
                        {member.role}
                      </Badge>
                      {canManage && member.role !== "OWNER" ? (
                        <RemoveMemberButton
                          workspaceId={workspace.id}
                          memberId={member.userId}
                          disabled={member.userId === session.user.id}
                        />
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Invite teammate</CardTitle>
            <p className="text-sm text-slate-500">
              Send a magic link invite. They&apos;ll need to sign in with the same email to accept.
            </p>
          </CardHeader>
          <CardContent>
            {canManage ? <InviteMemberForm workspaceId={workspace.id} /> : <p className="text-sm">Only admins can send invites.</p>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending invites</CardTitle>
          <p className="text-sm text-slate-500">Cancel invites that are no longer needed.</p>
        </CardHeader>
        <CardContent>
          {workspace.invites.length === 0 ? (
            <EmptyState title="No pending invites" description="Sent invites will appear here until accepted." />
          ) : (
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {workspace.invites.map((invite) => (
                <li
                  key={invite.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-800"
                >
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{invite.email}</p>
                    <p className="text-xs text-slate-500">Role: {invite.role}</p>
                    <p className="text-xs text-slate-500">Expires {invite.expiresAt.toLocaleString()}</p>
                  </div>
                  {canManage ? <CancelInviteButton workspaceId={workspace.id} inviteId={invite.id} /> : null}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
