import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getServerAuthSession } from "@/server/auth";
import { getInviteByToken } from "@/server/workspaces";
import { AcceptInviteForm } from "@/components/invites/accept-invite-form";

interface InvitePageProps {
  params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;
  const invite = await getInviteByToken(token);

  if (!invite) {
    notFound();
  }

  const session = await getServerAuthSession();
  const isPending = invite.status === "PENDING" && invite.expiresAt > new Date();

  return (
    <div className="bg-gradient-to-b from-white to-slate-50 py-16 dark:from-slate-950 dark:to-slate-900">
      <div className="container flex max-w-2xl flex-col gap-6">
        <Card className="border-slate-200 bg-white/90 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Join {invite.workspace?.name}
            </CardTitle>
            <p className="text-sm text-slate-500">
              {invite.creator?.name ? `${invite.creator.name} invited you` : "You&apos;ve been invited"} to collaborate as a {invite.role.toLowerCase()}.
            </p>
          </CardHeader>
          <CardContent className="space-y-6 text-sm text-slate-600 dark:text-slate-300">
            {!isPending ? (
              <div className="space-y-3">
                <p>This invitation is no longer valid.</p>
                <p className="text-xs text-slate-500">Reach out to the workspace owner to request a fresh invite.</p>
              </div>
            ) : session?.user ? (
              <AcceptInviteForm token={token} />
            ) : (
              <div className="space-y-4">
                <p>You&apos;ll need to sign in before accepting this invite.</p>
                <Link href={`/login?callbackUrl=${encodeURIComponent(`/invites/${token}`)}`}>
                  <Button className="w-full">Sign in to continue</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
