import { SettingsNav } from "@/components/navigation/settings-nav";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Settings</h1>
        <p className="text-sm text-slate-500">Manage your profile, team workspaces, and billing preferences.</p>
      </div>
      <SettingsNav />
      <div>{children}</div>
    </div>
  );
}
