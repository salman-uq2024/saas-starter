import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/server/auth";
import { listWorkspacesForUser } from "@/server/workspaces";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { AppTopbar } from "@/components/navigation/app-topbar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerAuthSession();
  if (!session?.user) {
    redirect("/login");
  }

  const workspaces = await listWorkspacesForUser(session.user.id);
  const activeWorkspaceId =
    workspaces.find((membership) => membership.workspace.id === session.user.defaultWorkspaceId)?.workspace.id ??
    workspaces[0]?.workspace.id;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <AppTopbar
          workspaces={workspaces}
          activeWorkspaceId={activeWorkspaceId}
          user={{ name: session.user.name, email: session.user.email, image: session.user.image }}
        />
        <main className="flex-1 px-4 py-6 md:px-8">
          <div className="mx-auto max-w-6xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
