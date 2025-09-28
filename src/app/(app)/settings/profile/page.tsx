import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/server/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/components/settings/profile-form";

export default async function ProfileSettingsPage() {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <p className="text-sm text-slate-500">Update how your name appears across workspaces.</p>
        </CardHeader>
        <CardContent>
          <ProfileForm defaultName={session.user.name ?? ""} defaultTimezone={session.user.timezone ?? "UTC"} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Account details</CardTitle>
          <p className="text-sm text-slate-500">Email is linked to magic-link authentication.</p>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400">Email</p>
            <p className="font-medium">{session.user.email}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400">Default workspace ID</p>
            <p className="font-medium">{session.user.defaultWorkspaceId ?? "Auto-selected"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400">Timezone</p>
            <p className="font-medium">{session.user.timezone ?? "UTC"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
